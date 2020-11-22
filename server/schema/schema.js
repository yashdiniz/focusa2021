const graphql = require('graphql');
const { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: "Book Type: Holds book details",
    fields: () => ({ // using lazy evaluation to help fix cyclical references
        id : {
            type: GraphQLID
        },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    description: "A root query.",
    fields: {
        book: {
            type: BookType,
            desription: "Get a book based on the particular ID.",
            args: {
                id: { type: GraphQLID }
            },
            resolve (parent, args, ctx, info) {
                // code to resolve data from DB
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
})