import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // new model for list items
  ListItem: a
    .model({
      name: a.string().required(),
      description: a.customType({
        short: a.string(),
        long: a.string(),
      }),
      price: a.float().required(),
      visible: a.boolean().default(true),
      visibleTo: a.string().default("everyone"), // everyone, members, owner, none
      expiresAt: a.string(),
      isDigital: a.boolean().default(false),
      currency: a.string().default("USD"),
      country: a.string(),
      state: a.string(),
      location: a.string(),
      coverImage: a.string(),
      otherImages: a.json(),
      contactMethod: a.string(),
      contactEmail: a.string(),
      contactPhone: a.string(),
      contactName: a.string(),
      userSub: a.string(),
      peopleRequired: a.integer(),
      members: a.json(), // userSub, contactName, contactEmail, contactPhone, isOwner, status
      removedMembers: a.json(), // userSub, contactName, contactEmail, contactPhone, isOwner, status
      status: a.string().default("active"), // active, inactive, closed
    })
    .authorization((allow) => [
      // allow.guest(),
      // allow.authenticated(),
      allow.publicApiKey(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
  // authorizationModes: {
  //   defaultAuthorizationMode: "identityPool",
  // },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
