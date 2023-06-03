import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Landing from '../components/ui/Landing';
import Messages from '../components/Messages';
import TextChat from '../components/Input';
import PaymentForm from '../components/Payments/PaymentForm.jsx';
import { useAuthContext } from "../hooks/AuthContext.tsx";

import store from '~/store';
import { useGetMessagesByConvoId, useGetConversationByIdMutation } from '~/data-provider';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51MwvEEHKD0byXXClhlIY96bsuIIIcdGgTenVqBnktRp8fzoUHlcI29yTj9ktyqumu2Xk1uz7KptFryWfTZz5Sdj200f3cPZSa3');

export default function Chat() {
  const { user } = useAuthContext();
  console.log("user:", user);
  const userId = user?.id;
  const searchQuery = useRecoilValue(store.searchQuery);
  const [conversation, setConversation] = useRecoilState(store.conversation);
  const setMessages = useSetRecoilState(store.messages);
  const messagesTree = useRecoilValue(store.messagesTree);
  const { newConversation } = store.useConversation();
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const messagesQuery = useGetMessagesByConvoId(conversationId, { enabled: false });
  const getConversationMutation = useGetConversationByIdMutation(conversationId);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [freeMsgs, setFreeMsgs] = useState(user?.freeMessages || null); // Set initial state with user.freeMessages

  const handlePaymentSuccess = (paymentMethodId) => {
    console.log("Payment Successful:", paymentMethodId);
    console.log("Remaining free messages:", user.freeMessages);
    setPaymentSuccess(true);
  };

  // when conversation changed or conversationId (in url) changed
  useEffect(() => {
    if (conversation === null) {
      // no current conversation, we need to do something
      if (conversationId === 'new') {
        // create new
        newConversation();
      } else if (conversationId) {
        // fetch it from server
        getConversationMutation.mutate(conversationId, {
          onSuccess: (data) => {
            setConversation(data);
          },
          onError: (error) => {
            console.error('failed to fetch the conversation');
            console.error(error);
            navigate('/chat/new');
            newConversation();
          },
        });
        setMessages(null);
      } else {
        navigate('/chat/new');
      }
    } else if (conversation?.conversationId === 'search') {
      // jump to search page
      navigate(`/search/${searchQuery}`);
    } else if (conversation?.conversationId !== conversationId) {
      // conversationId (in url) should always follow conversation?.conversationId, unless conversation is null
      navigate(`/chat/${conversation?.conversationId}`);
    }
    document.title = conversation?.title || import.meta.env.VITE_APP_TITLE || 'Chat';
  }, [conversation, conversationId]);

  useEffect(() => {
    if (messagesTree === null && conversation?.conversationId) {
      messagesQuery.refetch(conversation?.conversationId);
    }
  }, [conversation?.conversationId, messagesQuery, messagesTree]);

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    } else if (messagesQuery.isError) {
      console.error('failed to fetch the messages');
      console.error(messagesQuery.error);
      setMessages(null);
    }
  }, [messagesQuery.data, messagesQuery.isError, setMessages]);

  if (conversation?.conversationId === 'search') return null;

  if (conversation?.conversationId !== conversationId) return null;

  if (!conversationId) return null;

  return (
    <>
      {conversationId === 'new' && !messagesTree?.length ? <Landing /> : <Messages />}
      {!paymentSuccess ? (
        <div>
          <h3>Please make a payment to enable sending messages</h3>
          {freeMsgs !== null && <h4>Remaining free messages: {freeMsgs}</h4>}
          <Elements stripe={stripePromise}>
            <PaymentForm userId={userId} handlePaymentSuccess={handlePaymentSuccess} />
          </Elements>
        </div>
      ) : (
        <TextChat />
      )}
    </>
  );
};