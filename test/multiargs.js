(function(buster, when) {

var assert, refute, fail, sentinel;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

sentinel = {};

function fakeResolved(val) {
	return {
		then: function(callback) {
			return fakeResolved(callback ? callback(val) : val);
		}
	};
}

function fakeRejected(reason) {
	return {
		then: function(callback, errback) {
			return errback ? fakeResolved(errback(reason)) : fakeRejected(reason);
		}
	};
}

buster.testCase('when.defer.multiargs', {

	'resolve': {
    'should resolve promise multiargs': function(done) {
      var d = when.defer();
      d.promise.then(
        function(a,b) {
          assert.equals(a, 1);
          assert.equals(b, 2);
        },
        fail
      ).always(done);

      d.resolve([1,2]);
    },
    'should resolve a multiargs': function(done) {
      var d = when.defer();
      d.then(
        function(a,b){
          assert.equals(a, 1);
          assert.equals(b, 2);
        },
        fail
      ).always(done);
      d.resolve([1,2]);
    },
    'should 1': function(done) {
      var d = when.defer();
      d.promise.then(
        function(a,b) {
          assert.equals(a, 3);
          assert.equals(b, 4);
        },
        fail
      ).always(done);

      d.resolve(3,4);
    },
    'should chain then': function(done) {
      var d = when.defer();
      d.promise
        .then(function(a,b) {
          assert.equals(a, 1);
          assert.equals(b, 2);
          return when.resolve(a,b);
        }, fail)
        .then(function(a,b) {
          assert.equals(a, 1);
          assert.equals(b, 2);
        }, fail).always(done);

      d.resolve(1,2);
    },
    'should be mixed args': function(done) {
      var d = when.defer();
      d.promise
        .then(
          function(a,b) {
            assert.equals(a[0], 1);
            assert.equals(a[1], 2);
            assert.equals(b, 3);
          },
          fail
        ).always(done);
      d.resolve([1,2], 3);
    }
  }
});

})(
	this.buster || require('buster'),
	this.when   || require('..')
);
