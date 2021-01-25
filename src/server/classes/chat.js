const _ = require('underscore');

const RoomModel = require('../models/room');
const MessageModel = require('../models/message');
const { Upload } = require('../classes/upload');
const UserModel = require('../models/user');

class Chat {

    static createChat(data) {
        return new Promise((resolve, reject) => {
            RoomModel.find({ type: 'CHAT' })
                .and({ 'participants': [data.user, data.contact] })
                .exec((err, chats) => {

                    if (err) return reject({ code: 500, err });

                    if (chats.length > 0) return reject({ code: 400, err: 'Chat exists!!' });
                    let chat = new RoomModel(data);

                    chat.save((err, chatCreated) => {
                        if (err) return reject({ code: 500, err });
                        if (!chatCreated) return reject({ code: 400, err: 'Could not create the chat.' });

                        // add conversation at user and contact; delete contact
                        Promise.all([
                                this.deleteContactAddConversation(data.user, data.contact, chatCreated._id),
                                this.deleteContactAddConversation(data.contact, data.user, chatCreated._id),
                            ])
                            .then(responses =>
                                resolve({
                                    data: {
                                        user: responses[0],
                                        contact: responses[1],
                                        room: chatCreated._id
                                    }
                                })
                            )
                            .catch(err => {
                                RoomModel.findOneAndRemove({ _id: chat._id });
                                reject({ code: 500, err });
                            });
                    });
                });
        });
    }

    // Search contact
    static searchContactOnChats(user) {
        return new Promise((resolve, reject) => {
            UserModel.findById(user, 'conversations')
                .populate({
                    path: 'conversations',
                    select: 'participants',
                    populate: [{
                        path: 'participants',
                        select: 'name user role email thumbnail_photography photography',
                        match: {
                            _id: {
                                $ne: user
                            }
                        }
                    }]
                })
                .exec((err, doc) => {
                    if (err) return reject({ code: 500, err });
                    let usersTmp = [];
                    let conversations = doc.conversations;
                    conversations.forEach(conversation => {
                        let participants = [];
                        conversation.participants.forEach(participant => {
                            participants.push({
                                ...participant._doc,
                                chat: conversation._id
                            })
                        })
                        usersTmp = _.union(usersTmp, participants)
                    });
                    resolve({ data: usersTmp });

                });
        });
    }

    // Search contact only id
    static searchContactOnChatsOnlyId(user) {
        return new Promise((resolve, reject) => {
            UserModel.findById(user, 'conversations')
                .populate({
                    path: 'conversations',
                    select: 'participants',
                    populate: [{
                        path: 'participants',
                        select: '_id',
                        match: {
                            _id: {
                                $ne: user
                            }
                        }
                    }]
                })
                .exec((err, users) => {

                    if (err) return reject({ code: 500, err });
                    let usersTmp = [];
                    users.conversations.forEach(conversation => {
                        usersTmp = _.union(usersTmp, conversation.participants)
                    });
                    resolve({ data: _.pluck(usersTmp, '_id') });

                });
        });
    }

    static deleteChat(chat, user) {

        return new Promise((resolve, reject) => {
            RoomModel.findByIdAndDelete(chat, (err, chatDeleted) => {

                if (err) return reject({ code: 500, err });

                if (!chatDeleted) return reject({ code: 400, err: 'Could not delete the Chat.' });

                let filesDeleted = 0;
                let messagesDeleted = 0;
                MessageModel.find({ room: chat, $or: [{ type: 'IMG' }, { type: 'FILE' }] }, (err, messagess) => {
                    if (err) return reject({ code: 500, err, msg: 'Could not found the messagess.' });

                    for (const message of messagess) {
                        Upload.deleteFile('messages', message.message);
                    }
                    filesDeleted = messagess.length;
                });
                MessageModel.deleteMany({ room: chat }, (err, result) => {
                    if (err) return reject({ code: 500, err, msg: 'Could not delete the messagess.' });
                    messagesDeleted = result.deletedCount;
                });

                const contact = chatDeleted.participants.filter(participant => participant != user)[0];
                // add contact at user and delete conversation
                Promise.all([
                        this.deleteConversationAddContact(user, contact, chatDeleted._id),
                        this.deleteConversationAddContact(contact, user, chatDeleted._id),
                    ])
                    .then(responses =>
                        resolve({
                            data: {
                                user: responses[0],
                                contact: responses[1],
                                totalMessagesDeleted: messagesDeleted,
                                totalFilesDeleted: filesDeleted
                            }
                        })
                    )
                    .catch(err => {
                        RoomModel.findOneAndRemove({ _id: chat._id });
                        reject({ code: 500, err });
                    });
            });
        });
    }

    static deleteUserChat(chat, user) {

        return new Promise((resolve, reject) => {
            RoomModel.findByIdAndDelete(chat, (err, chatDeleted) => {

                if (err) return reject({ code: 500, err });

                if (!chatDeleted) return reject({ code: 400, err: 'Could not delete the Chat.' });

                let filesDeleted = 0;
                let messagesDeleted = 0;
                MessageModel.find({ room: chat, $or: [{ type: 'IMG' }, { type: 'FILE' }] }, (err, messagess) => {
                    if (err) return reject({ code: 500, err, msg: 'Could not found the messagess.' });

                    for (const message of messagess) {
                        Upload.deleteFile('messages', message.message);
                    }
                    filesDeleted = messagess.length;
                });
                MessageModel.deleteMany({ room: chat }, (err, result) => {
                    if (err) return reject({ code: 500, err, msg: 'Could not delete the messagess.' });
                    messagesDeleted = result.deletedCount;
                });

                const contact = chatDeleted.participants.filter(participant => participant != user)[0];
                // add contact at user and delete conversation
                Promise.all([
                        this.deleteConversation(user, chatDeleted._id),
                        this.deleteConversation(contact, chatDeleted._id),
                    ])
                    .then(responses =>
                        resolve({
                            data: {
                                user: responses[0],
                                contact: responses[1],
                                totalMessagesDeleted: messagesDeleted,
                                totalFilesDeleted: filesDeleted
                            }
                        })
                    )
                    .catch(err => {
                        RoomModel.findOneAndRemove({ _id: chat._id });
                        reject({ code: 500, err });
                    });
            });
        });
    }

    /***************************
     * Utils
     ***************************/

    static deleteContactAddConversation(user, contact, conversation) {
        return new Promise((resolve, reject) => {
            UserModel.findByIdAndUpdate(user, { $pull: { contacts: contact } }, { new: true })
                .populate('contacts', 'name last_name user email thumbnail_photography')
                .exec((err, user) => {
                    if (err) return reject({ code: 500, err });

                    if (!user)
                        return reject({ code: 400, err: 'Could not remove the contact.' });

                    UserModel.findByIdAndUpdate(user, { $addToSet: { conversations: conversation } }, { new: true })
                        .populate({
                            path: 'conversations',
                            populate: [{
                                    path: 'participants',
                                    select: 'name user role email thumbnail_photography',
                                    match: {
                                        _id: {
                                            $ne: user
                                        }
                                    }
                                }]
                                // populate: [{ path: 'participants', select: 'name user role email thumbnail_photography' }, { path: 'admins', select: 'name user role email thumbnail_photography' }]
                        })
                        .exec((err, userConversations) => {
                            if (err) return reject({ code: 500, err });

                            if (!userConversations)
                                return reject({ code: 400, err: 'Could not add the conversation.' });

                            resolve({
                                data: {
                                    contacts: user.contacts,
                                    conversations: userConversations.conversations
                                }
                            });
                        });
                });
        });
    }


    static deleteConversationAddContact(user, contact, conversation) {
        return new Promise((resolve, reject) => {
            UserModel.findByIdAndUpdate(user, { $pull: { conversations: conversation } }, { new: true })
                .populate({
                    path: 'conversations',
                    populate: [{
                            path: 'participants',
                            select: 'name user role email thumbnail_photography',
                            match: {
                                _id: {
                                    $ne: user
                                }
                            }
                        }]
                        // populate: [{ path: 'participants', select: 'name user role email thumbnail_photography' }, { path: 'admins', select: 'name user role email thumbnail_photography' }]
                })
                .exec((err, user) => {
                    if (err) return reject({ code: 500, err });

                    if (!user)
                        return reject({ code: 400, err: 'Could not remove the conversation.' });

                    UserModel.findByIdAndUpdate(user, { $addToSet: { contacts: contact } }, { new: true })
                        .populate('contacts', 'name last_name user email thumbnail_photography')
                        .exec((err, userContacts) => {
                            if (err) return reject({ code: 500, err });

                            if (!userContacts)
                                return reject({ code: 400, err: 'Could not add the contact.' });

                            resolve({
                                data: {
                                    contacts: userContacts.contacts,
                                    conversations: user.conversations
                                }
                            });
                        });
                });
        });
    }


    /***************************
     * Only delete conversation of user
     ***************************/
    static deleteConversation(user, conversation) {
        return new Promise((resolve, reject) => {
            UserModel.findByIdAndUpdate(user, { $pull: { conversations: conversation } }, { new: true })
                .populate({
                    path: 'conversations',
                    populate: [{
                        path: 'participants',
                        select: '_id',
                        match: {
                            _id: {
                                $ne: user
                            }
                        }
                    }]
                })
                .exec((err, user) => {
                    if (err) return reject({ code: 500, err });

                    if (!user)
                        return reject({ code: 400, err: 'Could not remove the conversation.' });

                    resolve({
                        data: {
                            conversations: user.conversations
                        }
                    });
                });
        });
    }
}

module.exports = {
    Chat
}