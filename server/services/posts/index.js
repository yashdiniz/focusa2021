const express = require('express');
const app = express();
const { coursesPort } = require('../../config');
const {getPostByID, deletePost, createPost, editPost, searchPosts, getPostsByAuthor, getPostsByCourse} = require('./functions');
const jwt = require('../jwt');

