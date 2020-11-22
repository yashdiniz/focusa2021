# GraphQL schema

This folder contains the code and documentation for the FOCUSA GraphQL schema. One of the good things about GraphQL is that it supports really good internal documentation. However, to make it easier working as a team, we shall follows these conventions.

1. Each `GraphQL Object Type` has to be saved in a separate file, importing whatever is required, and isolating the types for easier error resolution. This includes the **Query** and **Mutation** being in separate files as well, with all other object types imported to the file as required.

The GraphQL layer is a well-designed router, and so we need to pay special attention to the resolvers. Since the resolvers will essentially interact with microservices to fetch data, the isolation will be pretty simple.

We shall follow [this form of code breakdown](https://nanofaroque.medium.com/solid-code-in-nodejs-a87685b4cdfe) for our microservices ultimately.
