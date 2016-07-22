# Adding api doc


use the following comment blocks above the routes:

do a replace all on:

```
<routecaps> : the routename in capitals
```
```
<route>     : the routename as a title, lowercase
```
```
<routesingle>: label of a single instance of <route> (horses => horse)
```

## GET ALL
```
/**
 * @apiGroup <route>
 * @apiVersion 1.0.0
 * @api {get} /<route> Get all <route>
 * @apiParam {Number} limit request parameter ?limit=20 limits unique <routesingle> number to 20
 * @apiParam {Number} skip  request parameter ?skip=5 pagination parameter
 * @apiSchema {jsonschema=../test/data/apischemas/<routecaps>-GET-return-an-array-of-<route>-SUCCESS.json} apiSuccess
 * @apiDescription Return an array of <route>, paginated by 20.
 */
```

## GET ONE
```
/**
 * @apiGroup <route>
 * @apiVersion 1.0.0
 * @api {get} /<route>/:id Get one <routesingle>
 * @apiParam {string} :id <routesingle> id
 * @apiSchema {jsonschema=../test/data/apischemas/<routecaps>-GET-get-one-<routesingle>-SUCCESS.json} apiSuccess
 * @apiDescription Get one <routesingle>
 */
```

## POST
```
/**
 * @apiGroup <route>
 * @apiVersion 1.0.0
 * @api {post} /<route> Create a new <routesingle>
 * @apiSchema {jsonschema=../test/data/apischemas/<routecaps>-POST-create-a-new-<routesingle>-PARAMS.json} apiParam
 * @apiSchema {jsonschema=../test/data/apischemas/<routecaps>-POST-create-a-new-<routesingle>-SUCCESS.json} apiSuccess
 * @apiDescription Create a new <routesingle>
 */
 ```

## DELETE
```
/**
 * @apiGroup <route>
 * @apiVersion 1.0.0
 * @api {delete} /<route>/:id Delete a single <routesingle>
 * @apiParam {string} :id <routesingle> id
 * @apiSchema {jsonschema=../test/data/apischemas/<routecaps>-DELETE-remove-a-<routesingle>-SUCCESS.json} apiSuccess
 * @apiDescription Delete a single <routesingle> by id
 */
```

## PUT
```
/**
 * @apiGroup <route>
 * @apiVersion 1.0.0
 * @api {put} /<route>/:id Change an <routesingle>
 * @apiParam {string} :id <routesingle> id
 * @apiSchema {jsonschema=../test/data/apischemas/<routecaps>-PUT-change-a-<routesingle>-PARAMS.json} apiParam
 * @apiSchema {jsonschema=../test/data/apischemas/<routecaps>-PUT-change-a-<routesingle>-SUCCESS.json} apiSuccess
 * @apiDescription Change a single <routesingle>
 */
 ```
