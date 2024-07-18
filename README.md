# Blog-Engine

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fsujanchhetri%2Fblog-engine&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)
 <a href="https://nodejs.org/en/blog/release/v14.15.4/"><img alt="NodeJS" src="https://img.shields.io/badge/node-14.15.4-important?style=flat-square" /></a>
 <a href="https://www.npmjs.com/package/npm/v/6.14.10"><img alt="NPM" src="https://img.shields.io/badge/npm-6.14.10-61DAFB?style=flat-square" /></a>
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

# About

Blogue is a production-ready, multi-user blogging platform built with the MERN (MongoDB, Express, React, Node.js) stack and Next.js. The platform focuses on providing an optimized user experience with server-side rendering (SSR) and static site generation (SSG) to ensure high performance and excellent SEO. With Blogue, users can create, manage, and share their blogs seamlessly. The application is designed to handle multiple users with different roles and provides a robust authentication system.
Features

    User Signup / Signin: New users can sign up and existing users can sign in to access the platform.
    JWT based Authentication System: Secure authentication using JSON Web Tokens.
    Role Based Authorization System: Differentiated access for users and admins.
    Blogs Search: Search functionality to find blogs easily.
    Related Blogs: Display related blogs to enhance content discovery.
    Categories: Organize blogs into different categories.
    Tags: Tagging system for better blog categorization.
    User Profile: Personalized user profiles.
    Blog Author Private Contact Form: Private contact form for users to contact blog authors.
    Multiple User Authorization System: Support for multiple user roles and permissions.
    Social Login with Google: Easy login using Google accounts.
    Admin / User Dashboard Privilege: Separate dashboards for admins and users with respective privileges.
    Image Uploads: Support for uploading images to blogs.
    Load More Blogs: Pagination functionality to load more blogs.

# Tech Stack

    Frontend:
        React.js
        Next.js (for SSR and SSG)
        HTML
        CSS

    Backend:
        Node.js
        Express.js
        MongoDB

    Authentication:
        JWT (JSON Web Token)
        Social Login (Google)


### Usage
You can access the following endpoints on http://localhost:8000/api

- - -

#### Authentication

- - -

| Method      | Path |   
| ---        |    ----   |  
| post      | /pre-signup      | 
| post   | /signup       | 
| post   | /signin       | 
| post   | /google-login      | 
| get   | /signout        |
| get   | /secret        |
| put   | /forgot-password        | 
| put   | /reset-password |  

- - -

#### Blog-Post

- - -

| Method      | Path |    
| ---        |    ----   | 
| post      | /blog     |
| post   | /blogs-categories-tags       | 
| post   | /blogs/related     |
| post   | /user/blog      |
| get   | /blogs       |
| get   | /blog/:slug       | 
| get   | /blog/photo/:slug       |
| get   | /blogs/search | 
| get   | /:username/blogs |   
|delete  | /blog/:slug |   
|delete  | /user/blog/:slug |   
|put  | /blog/:slug |   
|put  | /user/blog/:slug |   



- - -

#### Categories , Tags & Form

- - -

| Method      | Path |    
| ---        |    ----   | 
| post      | /category   |
| post   | /tag      | 
| post   | /contact     | 
| post   | /contact-blog-author     | 
| get   | /categories      |
| get   | /category/:slug      | 
| get   | /tags       |
| get   | /tag/:slug | 
|delete  | /category/:slug |   
|delete  | /tag/:slug |   
 
 - - -

#### User

- - -

| Method      | Path |    
| ---        |    ----  | 
| get   | /user/profile      |
| get   | /user/:username     | 
| get   | /user/photo/:username      |
| put  | /user/update     |
| put  | /user/follow     |
| put  | /user/unfollow     |

<br/>

## Contributing

There are two ways to contribute to this project. **submitting new features or fixing bugs** 


### To submit a new feature or a bugfix

Please contribute! There are plenty of work to do. To get started, you have to [fork](https://github.com/sujanchhetri/blog-engine/fork) this repo to your own GitHub account first. Then open up a terminal on your machine and enter the following commands:

> Add the requirements in the .env file

```bash
git clone https://github.com/<your user name>/blog-engine.git
cd blog-engine
npm install
npm start
```
or 

```bash
docker pull sujjjan/blog-engine
```

This will start the development server on `http://localhost:8000/`. This should reload automatically when you make changes to the code, but no code is perfect, so sometimes you may need to restart it. :)

If you want to submit a new feature or a bugfix, the best way is to create the changes in a separate branch, e.g.: `git checkout -b feature/mycoolfeature`. This will make it easier for you to submit a pull request and get your feature merged.

> Upgrading this project to  typescript are most welcome

- - -

#### This engine is used by [Blogue](https://blogue.tech)
