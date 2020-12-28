'use strict';
const Issue = require('../models/issue');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      try {
        let project = req.params.project;
        const issues = await Issue.find({ 
          project,
          ...req.query
        }).select('-__v -project');
        res.json(issues);
      } catch (err) {
        console.log(err);
      }
    })
    
    .post(async function (req, res){
      try {
        let project = req.params.project;
        let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
        if (!issue_title || !issue_text || !created_by) throw new Error();
        const issue = await new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to ? assigned_to : '',
          status_text: status_text ? status_text : '',
        }).save();
        res.json(issue);
      } catch (err) {
        res.json({ error: 'required field(s) missing'});
      }
    })
    
    .put(async function (req, res){
      let id;
      try {
        let project = req.params.project;
        const { _id, ...query } = req.body;
        id = _id;
        if (!_id) throw new Error("missing _id");
        const issue = await Issue.updateOne({ _id }, {
          ...query,
          updated_on: new Date()
        });
        if (!issue) throw new Error();
        if (Object.keys(query).length === 0 && query.constructor === Object) {
          throw new Error('no update field(s) sent');
        }
        res.json({
          result: 'successfully updated',
          _id: _id
        });
      } catch (err) {
        if (err.message === 'missing _id') res.json({ error: 'missing _id'});
        else if (err.message === 'no update field(s) sent'){
          res.json({ error: 'no update field(s) sent', _id: id});
        }
        else {
          res.json({ error: 'could not update', _id: id});
        }
      }
      
    })
    
    .delete(async function (req, res){
      let id;
      try {
        let project = req.params.project;
        const { _id } = req.body;
        id = _id;
        if (!_id) throw new Error("missing _id");
        const deleted = await Issue.deleteOne({ _id });
        if (!deleted) throw new Error();
        res.json({
          result: 'successfully deleted',
          _id: _id
        });
      } catch (err) {
        if (err.message === 'missing _id') res.json({ error: 'missing _id'});
        else {
          res.json({ error: 'could not delete', _id: id});
        }
      }
    });
    
};
