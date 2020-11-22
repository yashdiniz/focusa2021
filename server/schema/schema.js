const graphql = require('graphql');
const { 
    GraphQLID, 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLInt 
} = graphql;

const booksTable = [ // temporarily using a simple JSON lookup table
    {
        id: 'jkrhp1',
        name: "Harry Potter and the Philosopher's stone.",
        genre: "Fiction, Mystery",
        author: 'jkr',
    },
    {
        id: 'jkrhp2',
        name: "Harry Potter and the Chamber of Secrets.",
        genre: "Fiction, Mystery",
        author: 'jkr',
    },
    {
        id: 'cdpp',
        name: "The Pickwick Papers.",
        genre: "Fiction",
        author: 'cd',
    },
    {
        id: 'hgwim',
        name: "The Invisible Man.",
        genre: "Science Fiction",
        author: 'hgw',
    },
]
const authorsTable = [
    { id:'jkr', name: "JK Rowling", age: 44 },
    { id:'cd', name: "Charles Dickens", age: 256 },
    { id:'hgw', name: "HG Wells", age: 123 },
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: "Holds book details",
    fields: () => ({ // using lazy evaluation to help fix cyclical references
        id : {
            type: GraphQLID
        },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args, ctx, info) {  // We put resolve in BookType, not in AuthorType, because resolution should happen at reference
                // `parent` holds what was resolved at the higher node.
                return authorsTable.find(e => e['id'] == parent['author'])
            }
        },
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: "Holds author details",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: GraphQLList(BookType),
            resolve(parent) {
                return booksTable.filter(e => e['author'] == parent['id'])  // filters out all unnecessary
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    description: "A root query.",
    fields: {
        book: {
            type: BookType,
            description: "Get a book based on ID.",
            args: {
                id: { type: GraphQLID }
            },
            resolve (parent, args, ctx, info) {
                return booksTable.find(e => e['id'] == args.id);
            }
        },
        books: {
            type: GraphQLList(BookType),
            description: "Get all books.",
            resolve () {
                return booksTable
            }
        },
        author: {
            type: AuthorType,
            description: "Get an author based on ID.",
            args: {
                id: { type: GraphQLID },
            },
            resolve(_, args) {
                return authorsTable.find(e => e['id'] == args.id);
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: "Get all authors",
            resolve () {
                return authorsTable;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
})