# 2. Use Express web framework

Date: 2017-01-29

## Status

Accepted

## Context

A web framework is needed in order to provide a level of abstraction over low
level language features. Effort spent solving non-domain specific problems
should be kept to an absolute minimum. The decision of using Express and Node.js
where made at (platform level)[https://github.com/search?q=topic%3Aconnecting-to-services+org%3Anhsuk&type=Repositories],
and the team had experience in creating these types of applications.

## Decision

We will use the [Express](http://expressjs.com/) web framework. This will
provide a lot of well
[documented](http://expressjs.com/en/resources/books-blogs.html) features and
functionality. Whilst providing a fast, unopinionated, minimalist web
framework.
Express is one of the most popular web frameworks available for NodeJS and as
such has been well tested and is deployed across many
[organisations](http://expressjs.com/en/resources/companies-using-express.html).

## Consequences

Due to Express being a minimalist web framework, when additional features are
required they are added as
[middleware](http://expressjs.com/en/resources/middleware.html) modules.
A working knowledge of existing modules will help with reducing duplication of
effort by where modules may already exist within the community.
Middleware modules created by us may be useful to other members of the
community, providing an opportunity for us to contribute back.

The unopinionated nature of Express means there are more decisions to
be taken around which component should be used across a wide range of
features. Other, more opinionated frameworks will have fewer choices required
by the end user. This means, initially, more time will be required assessing
which component is best to use. On the flip side the ability to swap out
components for any number of reasons becomes more straight forward.