import { createClient } from 'urql';
import { Client, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const endPoint = "react.eogresources.com/graphql"

const clientSuscription = new Client({
  url: `https://${endPoint}`,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return new SubscriptionClient(`wss://${endPoint}`, { reconnect: true }).request(operation);
      },
    }),
  ],
});

const client = createClient({
  url: `https://${endPoint}`,
});

export {client, clientSuscription};