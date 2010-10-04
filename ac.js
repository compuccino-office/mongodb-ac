/**
 * Simple Analzye of Datasets in a Collection
 *
 * ac = analyze collection
 * use:
 * mongo <dbname>
 * > load("collection.analyze.js")
 * > ac("<collection-name>")
 * or
 * > ac("<collection-name>", "<to permanent save collection-name>")
 *
 */

/**
 * @group Funktionen für MapReduce
 */


function _typeof( data ){
	if( data === undefined ) return "undefined";
	else if( data === null ) return "null";
	else if( data.length !== undefined && data.toLowerCase === undefined ) return "array";
	else if( data.isObjectId ) return "ObjectId";
	else if( data.$dbref != undefined ) return "DBRef";
	else if( data.getMonth !== undefined ) return "Date";
	else if( data.exec !== undefined ) return "RegExp";
	else return typeof data;
}

function maper(){
	var id = [], k, keys = {};
	for( k in this ) {
		curr = this[k];
		if( onlyField && onlyField != k ) continue;
		currType = _typeof(curr);
		if( currType == "array" && curr.length != 0 ) {
			currType += "." + _typeof( curr[0] );
		}
		id.push( k+"."+currType );
		keys[k] = currType;
	}
	id = id.sort().join(';');
	emit( {
		'id': id
	}, {
		'keys': keys,
		'count': 1
	} );
}

function reducer( key, counters ) {
	var total = 0, i, l = counters.length;
	for( i=0; i < l; i++ ) total += counters[i].count;
	return {
		count: total,
		keys: counters[0].keys
	};
}

/**
 * @group Helper Methods
 */

String.prototype.repeat = function( _int ) {
	return new Array(_int+1).join( this );
}

String.prototype.center = function( _int, str ) {
	if( str === undefined ) str = "*";
	var l = Math.floor( (_int - this.length) / 2),
			r = Math.ceil( (_int - this.length) / 2);
	if( l < 0 ) return this;
	return [ str.repeat(l), this, str.repeat(r) ].join("");
}

/**
 * @group Eigentliche Methode
 */

function ac( collectionName, outName ) {
	if( !collectionName ){
		print( "we need a collection name!" );
		return;
	}
	if( outName ) {
		print( "".center(120) );
		print( "output table specified we will save the results in: "+outName );
	}
	var coll = db.getCollection( collectionName );
	var collCounter = coll.count();
	if( collCounter == 0 ){
		print( "in collection "+collectionName+" are a no datasets!" );
		return;
	}
	var opts = {
		scope: {
			_typeof: _typeof,
			onlyField: undefined
		},
		verbose: false
	};
	if( outName ) opts.out = outName;
	res = coll.mapReduce( maper, reducer, opts );
	print( " mapReduce Result: ".center(120) );
	print( "time: " + res.timeMillis + " millis" );
	print( "input: " + res.counts.input );
	print( "different data types: " + res.counts.output );
	
	var curs = db[res.result].find().sort( {
		'value.count': -1
	} );
	var c = 1;
	curs.forEach( function( data ) {
		var k;
		print( (" data-type: "+c+" ").center(120) );
		print( "counts: " + data.value.count  + " from " + collCounter + " datasets" );
		print( "fields:" );
		for( k in data.value.keys ) {
			print( "\t"+ k + ", " + data.value.keys[k] );
		}
		c++;
	} );
}

function acField( fieldName, collectionName, outName ) {
	if( !fieldName ){
		print( "we need a field name!" );
		return;
	}
	if( !collectionName ){
		print( "we need a collection name!" );
		return;
	}
	if( outName ) {
		print( "".center(120) );
		print( "output table specified we will save the results in: "+outName );
	}
	var coll = db.getCollection( collectionName );
	var collCounter = coll.count();
	if( collCounter == 0 ){
		print( "in collection "+collectionName+" are a no datasets!" );
		return;
	}
	var opts = {
		query: {},
		scope: {
			_typeof: _typeof,
			onlyField: fieldName
		},
		verbose: false
	};
	if( outName ) opts.out = outName;
	
	opts.query[fieldName] = { "$exists": true };
	
	res = coll.mapReduce( maper, reducer, opts );
	print( " mapReduce Result: ".center(120) );
	print( "time: " + res.timeMillis + " millis" );
	print( "input: " + res.counts.input );
	print( "different data types: " + res.counts.output );
	
	var curs = db[res.result].find().sort( {
		'value.count': -1
	} );
	var c = 1;
	curs.forEach( function( data ) {
		var k;
		print( (" data-type: "+c+" ").center(120) );
		print( "counts: " + data.value.count  + " from " + collCounter + " datasets" );
		print( "fields:" );
		for( k in data.value.keys ) {
			print( "\t"+ k + ", " + data.value.keys[k] );
		}
		c++;
	} );
}