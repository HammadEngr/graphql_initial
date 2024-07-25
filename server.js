const express = require("express")
const { createHandler } = require("graphql-http/lib/use/express")
const { buildSchema } = require("graphql")

const schema = buildSchema(
    `
    type Post {
        id:ID!
        title:String!
        content:String!
        author:Author!
    }
    type Author {
        id:ID!
        name:String!
        posts:[Post]!
    }
    type Query {
        posts:[Post!]!
        authors:[Author!]!
        post(id:ID!):Post
        author(id:ID):Author
    }
    `
)

const postsData = [
    { id: "1", title: "Introduction to GraphQL", content: "GraphQL is awesome!", authorId: "1" },
    { id: "2", title: "GraphQL Queries and Mutations", content: "Learn how to query and mutate data.", authorId: "2" },
    { id: "3", title: "Advanced GraphQL Techniques", content: "Explore advanced GraphQL concepts.", authorId: "1" }
];

const authorsData = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" }
];

const root = {
    posts() {
        return postsData
    },
    authors() {
        return authorsData
    },
    post({ id }) {
        return postsData.find(post => post.id === id)
    },
    author({ id }) {
        return authorsData.find(author => author.id === id)
    },
    Post: {
        author(post) {
            if (!post.authorId) {
                return null;
            }
            const author = authorsData.find(author => author.id === post.authorId);
            return author || null; // Return null if author is not found
        }
    }
}

const app = express()

app.use("/graphql", createHandler({
    schema: schema,
    rootValue: root,
}))

app.listen(4000, () => console.log("listening at 4000"))