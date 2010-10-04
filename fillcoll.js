/**
 * Fill the db with random content.
 *
 * mongo
 * > load('ac.js')
 * > load('fillcoll.js')
 * > db["random-test"].drop()
 * > fillcoll("random-test")
 * > acField("_id","random-test")
 * > ac("random-test")
 */

function fillcoll( name ) {
  var ra = Math.random,
      ro = Math.round,
      max = 10000;
  
  function r( l ) {
    return ro( l*ra() );
  }
  
  max = r(max);
  if( !name ) name = "test_" + ( (new Date()).getTime() ) + "_" + r( (new Date()).getTime() );
  
  var coll = db.getCollection( name );
  var collCounter = coll.count();
  if( collCounter != 0 ){
    print( "in collection "+name+" are datasets!" );
    return;
  }
  
  
  function randomString ( strl ) {
    if( strl == undefined ) { strl = 1000; }
    strl = r( strl );
    var maxChar = 60,
        str = "",
        i;
    for( i=0; i < strl; i++ ) {
      str += String.fromCharCode( 48+r(maxChar) );
    }
    return str;
  }
  
  function randomInt ( strl ) {
    if( strl == undefined ) { strl = 20; }
    strl = r( strl );
    var str = "", i;
    for( i=0; i < strl; i++ ) {
      str += String( r(10) );
    }
    if( strl == 0) return r( 10000 );
    return parseInt(str);
  }
  
  function randomDate(){
    return new Date( 1000 * 60 * 24 * 24 * r( 720000 ) );
  }
  
  function randomRegex(){
    return new RegExp( randomString(20).replace( /[^\w\d]+/g, '_' ) );
  }
  
  function randomData( rz ){
    if(!rz) rz = 5;
    var data = null,
        d = r( rz );
    switch( d ) {
      case 0:
        data = randomString();
      break;
      case 1:
        data = randomInt();
      break;
      case 2:
        data = randomDate();
      break;
      case 3:
        data = randomRegex();
      break;
      case 4:
        var rs = r( 10 ), kyz;
        data = [];
        for( ri=0;rs>ri;ri++ ){
          kyz = randomString(10);
          data[kyz] = randomData( 3 );
        }
      break;
      case 5:
        var rs = r( 10 ), ri;
        data = [];
        for( ri=0;rs>ri;ri++ ){
          data.push( randomData( 3 ) );
        }
      break;
    }
    return data;
  }
  
  for( i = 0; i < max; i++) {
    var obj = {}, z = r( 10 ), iz, kyz;
    obj['_id'] = randomData( 4 );
    for( iz=0; z > iz; iz++ ) {
      kyz = randomString(10);
      if( kyz.length ) obj[ kyz ] = randomData();
    }
    coll.insert( obj );
  }
  
  print( "in collection "+name+" are "+coll.count()+" datasets saved" );
  
}



function testdata(){
  var now = new Date();
  var data = [
    { name: 'test', tags: [], created: now, updated: now },
    { name: 'test 2', tags: [ "test 2", "test 2a" ], created: now, updated: now },
    { name: 'test 2a', tags: [ "test 3", "test 2a" ], created: now, updated: now },
    { name: 'test 3', tags: null, created: now, updated: now },
    { name: 'test 4', created: now, updated: now },
  ];
  var name = "test_" + now.getTime();
  var coll = db.getCollection( name );
  for( var i=0; i < data.length; i++ ) {
    coll.insert( data[i] );
  }
  
  load('ac.js')
  ac( name );
  coll.drop();
}