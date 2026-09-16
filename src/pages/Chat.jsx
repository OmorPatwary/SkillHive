import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axiosInstance';
import socket from '../socket';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const Chat = ({ user }) => {
  const location = useLocation();

  const receiverIdFromState = location.state?.receiverId;

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const scrollRef = useRef(null);

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit('register_user', currentUserId);
  }, [currentUserId]);

  const loadConversations = async () => {
    if (!currentUserId) return;

    try {
      const response = await API.get(`/chat/conversations/${currentUserId}`);
      setConversations(response.data);
      return response.data;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId || !receiverIdFromState) {
      return;
    }

    const createConversation = async () => {
      try {
        const response = await API.post('/chat/conversation', {
          senderId: currentUserId,
          receiverId: receiverIdFromState,
        });

        const conversation = response.data;
        const updatedConversations = await loadConversations();

        const existingConversation = updatedConversations.find(
          (item) => item._id === conversation._id
        );

        setCurrentChat(existingConversation || conversation);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    };

    createConversation();
  }, [currentUserId, receiverIdFromState]);

  useEffect(() => {
    if (!currentChat?._id) return;

    const conversationId = currentChat._id;

    setMessages([]);

    socket.emit('join_room', conversationId);

    const loadMessages = async () => {
      try {
        const response = await API.get(`/chat/messages/${conversationId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    return () => {
      socket.emit('leave_room', conversationId);
    };
  }, [currentChat]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (!message?._id) return;

      const messageConversationId =
        typeof message.conversationId === 'object'
          ? message.conversationId?._id
          : message.conversationId;

      if (!currentChat?._id) return;

      if (String(messageConversationId) !== String(currentChat._id)) {
        return;
      }

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (item) => String(item._id) === String(message._id)
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, message];
      });

      setConversations((previousConversations) => {
        return previousConversations
          .map((conversation) => {
            if (String(conversation._id) === String(currentChat._id)) {
              return {
                ...conversation,
                updatedAt: message.createdAt || new Date().toISOString(),
              };
            }

            return conversation;
          })
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [currentChat]);

  useEffect(() => {
    const handleConversationCreated = async () => {
      await loadConversations();
    };

    socket.on('conversation_created', handleConversationCreated);

    return () => {
      socket.off('conversation_created', handleConversationCreated);
    };
  }, [currentUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const getOtherUser = (members) => {
    if (!members || !currentUserId) {
      return {};
    }

    return (
      members.find((member) => {
        const memberId =
          typeof member === 'object' ? member?._id : member;

        return String(memberId) !== String(currentUserId);
      }) || {}
    );
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const text = newMessage.trim();

    if (!text || !currentChat?._id || !currentUserId) {
      return;
    }

    const otherUser = getOtherUser(currentChat.members);
    const receiverId = otherUser?._id;

    try {
      const response = await API.post('/chat/message', {
        conversationId: currentChat._id,
        sender: currentUserId,
        receiverId,
        text,
      });

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (message) => String(message._id) === String(response.data._id)
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, response.data];
      });

      setNewMessage('');

      setConversations((previousConversations) => {
        return previousConversations
          .map((conversation) => {
            if (String(conversation._id) === String(currentChat._id)) {
              return {
                ...conversation,
                updatedAt:
                  response.data.createdAt || new Date().toISOString(),
              };
            }

            return conversation;
          })
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container py-3 font-montserrat">
      <div
        className="card border-0 shadow-sm rounded-4 overflow-hidden"
        style={{ height: '80vh' }}
      >
        <div className="row g-0 h-100">
          {/* Left Side: Conversation List (Hides on mobile when a chat is open) */}
          <div
            className={`col-12 col-md-4 border-end bg-light p-3 h-100 overflow-y-auto ${
              currentChat ? 'd-none d-md-block' : 'd-block'
            }`}
          >
            <h5 className="fw-bold text-dark mb-3">Messages</h5>

            {conversations.length === 0 ? (
              <div className="text-muted small">No conversations yet</div>
            ) : (
              conversations.map((conversation) => {
                const other = getOtherUser(conversation.members);

                return (
                  <div
                    key={conversation._id}
                    onClick={() => setCurrentChat(conversation)}
                    className={`p-2 mb-2 rounded-3 d-flex align-items-center gap-2 ${
                      currentChat?._id === conversation._id
                        ? 'bg-primary text-white'
                        : 'bg-white text-dark shadow-sm'
                    }`}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={other.profilePic || DEFAULT_AVATAR}
                      alt={other.name || 'User'}
                      className="rounded-circle object-fit-cover border"
                      width="40"
                      height="40"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />

                    <div className="overflow-hidden">
                      <h6 className="mb-0 fw-semibold text-truncate">
                        {other.name || 'User'}
                      </h6>

                      <small className="opacity-75 text-truncate d-block">
                        {other.email || ''}
                      </small>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Side: Chat Window (Hides on mobile when no chat is open) */}
          <div
            className={`col-12 col-md-8 d-flex flex-column h-100 bg-white ${
              !currentChat ? 'd-none d-md-flex' : 'd-flex'
            }`}
          >
            {currentChat ? (
              <>
                {/* Chat Header with Mobile Back Button */}
                <div className="p-3 border-bottom fw-bold bg-light d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary me-2 d-md-none rounded-circle px-2"
                    onClick={() => setCurrentChat(null)}
                    title="Back"
                  >
                    ←
                  </button>

                  <img
                    src={
                      getOtherUser(currentChat.members)?.profilePic ||
                      DEFAULT_AVATAR
                    }
                    alt={getOtherUser(currentChat.members)?.name || 'User'}
                    className="rounded-circle object-fit-cover border me-2"
                    width="35"
                    height="35"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />

                  <span>
                    {getOtherUser(currentChat.members)?.name || 'User'}
                  </span>
                </div>

                {/* Messages Body */}
                <div className="p-3 flex-grow-1 overflow-y-auto d-flex flex-column gap-2">
                  {messages.map((message) => {
                    const senderId =
                      typeof message.sender === 'object'
                        ? message.sender?._id
                        : message.sender;

                    const isMyMessage =
                      String(senderId) === String(currentUserId);

                    return (
                      <div
                        key={message._id}
                        className={`d-flex flex-column ${
                          isMyMessage
                            ? 'align-items-end'
                            : 'align-items-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-4 shadow-sm text-break ${
                            isMyMessage
                              ? 'bg-primary text-white rounded-bottom-end-0'
                              : 'bg-light text-dark border rounded-bottom-start-0'
                          }`}
                          style={{
                            maxWidth: '75%',
                            fontSize: '0.95rem',
                          }}
                        >
                          {message.text}
                        </div>

                        {message.createdAt && (
                          <small className="text-muted mt-1">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </small>
                        )}
                      </div>
                    );
                  })}

                  <div ref={scrollRef} />
                </div>

                {/* Input Form */}
                <form
                  onSubmit={handleSend}
                  className="p-3 border-top d-flex gap-2 bg-light"
                >
                  <input
                    type="text"
                    className="form-control rounded-pill px-3"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                  />

                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;