/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_502580611")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation3545646658",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "createdBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_515447164",
    "hidden": false,
    "id": "relation3931565573",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "originalVideo",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4002212422",
    "max": 0,
    "min": 0,
    "name": "videoDuration",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3498314978",
    "max": 0,
    "min": 0,
    "name": "startTimings",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1783689402",
    "max": 0,
    "min": 0,
    "name": "endTimings",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_502580611")

  // remove field
  collection.fields.removeById("relation3545646658")

  // remove field
  collection.fields.removeById("relation3931565573")

  // remove field
  collection.fields.removeById("text4002212422")

  // remove field
  collection.fields.removeById("text3498314978")

  // remove field
  collection.fields.removeById("text1783689402")

  return app.save(collection)
})
