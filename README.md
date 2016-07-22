
![unit tests](https://risingstack-blog.s3-eu-west-1.amazonaws.com/2014/Oct/unit_testing.jpeg)

Writing API tests for a node.js API can be a tedious job. We are dealing with a single event loop, so we need to take in account callbacks. Especially when doing API testing, callbacks can quickly become a pain point. A lot of times, checking whether requests work means triggering other requests sequentially to see if the database was updated by previous requests. This is why, after refactoring a bit of my tests, I was able to create a simple end-to-end testscript that I would just call whenever I wrote a new route. Every time with different input data specific to the route of course. I was later able to tie in APIDoc, a documentation generator that will create a frontend containing the documentation for all your endpoints. So in the end all my endpoints were not only fully tested, but also automatically documented in one go. This was very nice and saved me a lot of time.

You can read the full tutorial on how to use this code [on my blog](http://jestersimpps.github.io/automated-e2e-api-testing-documentation-for-node-js/)
