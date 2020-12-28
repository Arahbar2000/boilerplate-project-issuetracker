const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('POST requests', function() {
        test('Create an issue with every field', function(done) {
            chai.request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    issue_title: 'sample issue',
                    issue_text: 'sample issue',
                    created_by: 'arian',
                    assigned_to: 'arian',
                    status_text: 'open'
                })
                .end(function(err, res) {
                    assert.equal(res.body.issue_title, 'sample issue');
                    assert.equal(res.body.issue_text, 'sample issue');
                    assert.equal(res.body.created_by, 'arian');
                    assert.equal(res.body.assigned_to, 'arian');
                    assert.equal(res.body.status_text, 'open');
                    assert.isBoolean(res.body.open);
                    assert.isNumber(Date.parse(res.body.created_on));
                    assert.isNumber(Date.parse(res.body.updated_on));
                    assert.isNotEmpty(res.body._id);
                    done();
                });
          });
        
          test('Create an issue only required fields', function(done) {
            chai.request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    issue_title: 'sample issue',
                    issue_text: 'sample issue',
                    created_by: 'arian',
                })
                .end(function(err, res) {
                    assert.equal(res.body.issue_title, 'sample issue');
                    assert.equal(res.body.issue_text, 'sample issue');
                    assert.equal(res.body.created_by, 'arian');
                    assert.isEmpty(res.body.assigned_to);
                    assert.isEmpty(res.body.status_text);
                    assert.isBoolean(res.body.open);
                    assert.isNumber(Date.parse(res.body.created_on));
                    assert.isNumber(Date.parse(res.body.updated_on));
                    assert.isNotEmpty(res.body._id);
                    done();
                });
          });
        
          test('Create an issue missing required fields', function(done) {
            chai.request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    issue_title: 'sample issue',
                    issue_text: 'sample issue'
                })
                .end(function(err, res) {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
          });

    });

    suite('GET requests', function() {
        test('View issues on a project', function(done) {
            chai.request(server)
                .get('/api/issues/project')
                .end(function(err, res) {
                    res.body.forEach(issue => {
                        assert.property(issue, 'issue_title');
                        assert.property(issue, 'issue_text');
                        assert.property(issue, 'created_by');
                        assert.property(issue, 'assigned_to');
                        assert.property(issue, 'status_text');
                        assert.property(issue, 'open');
                        assert.property(issue, 'created_on');
                        assert.property(issue, 'updated_on');
                        assert.property(issue, '_id');
                    })
                    done();
                });
          });
          test('View issues on a project with one filter', function(done) {
            chai.request(server)
                .get('/api/issues/project')
                .query({ open: true })
                .end(function(err, res) {
                    res.body.forEach(issue => {
                        assert.property(issue, 'issue_title');
                        assert.property(issue, 'issue_text');
                        assert.property(issue, 'created_by');
                        assert.property(issue, 'assigned_to');
                        assert.property(issue, 'status_text');
                        assert.property(issue, 'open');
                        assert.property(issue, 'created_on');
                        assert.property(issue, 'updated_on');
                        assert.property(issue, '_id');
                        assert.equal(issue.open, true);
                    })
                    done();
                });
          });
        
          test('View issues on a project with one filter', function(done) {
            chai.request(server)
                .get('/api/issues/project')
                .query({ open: true, created_by: 'arian' })
                .end(function(err, res) {
                    res.body.forEach(issue => {
                        assert.property(issue, 'issue_title');
                        assert.property(issue, 'issue_text');
                        assert.property(issue, 'created_by');
                        assert.property(issue, 'assigned_to');
                        assert.property(issue, 'status_text');
                        assert.property(issue, 'open');
                        assert.property(issue, 'created_on');
                        assert.property(issue, 'updated_on');
                        assert.property(issue, '_id');
                        assert.equal(issue.open, true);
                        assert.equal(issue.created_by, 'arian');
                    })
                    done();
                });
          });
          test('View issues on a project with multiple filter', function(done) {
            chai.request(server)
                .get('/api/issues/project')
                .query({ open: true, created_by: 'arian' })
                .end(function(err, res) {
                    res.body.forEach(issue => {
                        assert.property(issue, 'issue_title');
                        assert.property(issue, 'issue_text');
                        assert.property(issue, 'created_by');
                        assert.property(issue, 'assigned_to');
                        assert.property(issue, 'status_text');
                        assert.property(issue, 'open');
                        assert.property(issue, 'created_on');
                        assert.property(issue, 'updated_on');
                        assert.property(issue, '_id');
                        assert.equal(issue.open, true);
                        assert.equal(issue.created_by, 'arian');
                    })
                    done();
                });
          });
    });

    suite('PUT requests', function() {
        test('Update one field of an issue', function(done) {
            chai.request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ issue_title: 'arian', issue_text: 'hello', created_by: 'arian' })
                .end(function(err, res) {
                    const { _id } = res.body
                    chai.request(server)
                    .put('/api/issues/project')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({ _id: _id, open: false})
                    .end(function(err, res) {
                        assert.property(res.body, 'result');
                        assert.property(res.body, '_id');
                        assert.equal(res.body.result, 'successfully updated');
                        assert.equal(res.body._id, _id);
                        done();
                    })
                })
          });
        
          test('Update multiple fields of an issue', function(done) {
            chai.request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ issue_title: 'arian', issue_text: 'hello', created_by: 'arian' })
                .end(function(err, res) {
                    const { _id } = res.body
                    chai.request(server)
                    .put('/api/issues/project')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({ _id: _id, open: false, created_by: 'bob'})
                    .end(function(err, res) {
                        assert.property(res.body, 'result');
                        assert.property(res.body, '_id');
                        assert.equal(res.body.result, 'successfully updated');
                        assert.equal(res.body._id, _id);
                        done();
                    })
                })
          });
        
          test('Update an issue with missing _id', function(done) {
            chai.request(server)
                .put('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ open: false })
                .end(function(err, res) {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
          });
        
          test('Update an issue with missing update parameters', function(done) {
            chai.request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ issue_title: 'arian', issue_text: 'hello', created_by: 'arian' })
                .end(function(err, res) {
                    const { _id } = res.body
                    chai.request(server)
                    .put('/api/issues/project')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({ _id: _id })
                    .end(function(err, res) {
                        assert.property(res.body, 'error');
                        assert.property(res.body, '_id');
                        assert.equal(res.body.error, 'no update field(s) sent');
                        assert.equal(res.body._id, _id);
                        done();
                    })
                });
          });
        
          test('Update an issue with invalid _id', function(done) {
            chai.request(server)
                .put('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({_id: 'adfadgahrdfadf', open: false })
                .end(function(err, res) {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'could not update');
                    done();
                });
          });
    });

    suite('DELETE requests', function() {

        test('Delete an issue', function(done) {
            chai.request(server)
                .post('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ issue_title: 'arian', issue_text: 'hello', created_by: 'arian' })
                .end(function(err, res) {
                    const { _id } = res.body
                    chai.request(server)
                    .delete('/api/issues/project')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({ _id })
                    .end(function(err, res) {
                        assert.property(res.body, 'result');
                        assert.property(res.body, '_id');
                        assert.equal(res.body.result, 'successfully deleted');
                        assert.equal(res.body._id, _id);
                        chai.request(server)
                        .get('/api/issues/project')
                        .query({ _id })
                        .end(function(err, res) {
                            assert.isEmpty(res.body);
                            done();
                        })
                    })
                });
          });

          test('Delete an issue with invalid _id', function(done) {
            chai.request(server)
                .delete('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ _id: 'adfadgahrdfadf' })
                .end(function(err, res) {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'could not delete');
                    done();
                });
          });

          test('Delete an issue with missing _id', function(done) {
            chai.request(server)
                .delete('/api/issues/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({})
                .end(function(err, res) {
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
          });
    })

});
