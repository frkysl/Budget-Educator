// This array holds the column names of those we are excluding from Y-Axis
var excludes = ['DBN', 'School Name', 'Street Address', 'City', 'State', 
	'Zip Code', 'Borough', 'Latitude', 'Longitude', 'Coordinates', 'Budget',
	'Budget Per Student'];

// This array holds the distinct school types from the list of schools
// Currently implemented this way instead of adding each distinct school type as
// one iterates through the data mainly to save on 1000+ checks
var schoolType = ['Elementary', 'Junior High-Intermediate-Middle', 'K-8', 
	'Secondary School', 'Early Childhood', 'High school', 'K-12 all grades' ];

// Function to create the table given the data and the column names --- tabulate
var tabulate = function (data, columns) {
  var table = d3.select('#directory')
	var thead = table.append('thead')
	var tbody = table.append('tbody')
 
 	// Adds the column headers
	thead.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
	  .append('th')
	    .text(function (d) { return d })
 
 	// Adds the individual rows
	var rows = tbody.selectAll('tr')
	    .data(data)
	    .enter()
	  .append('tr')
	  .attr('id', function (d) { return d['DBN']; } )
	  .on( 'click', function() {
	  	// If you click on the row, it adds or removes the .schoolSelected class
		  $( this ).toggleClass( 'schoolSelected' );
		});

	// Adds the individual cells per row
	var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return columns.map(function (column) {
	    		return { column: column, value: row[column] }
	      })
      })
      .enter()
    .append('td')
      .text(function (d) { return d.value })
 
  return table;
}

// Imports the CSV, fills in the Y-Axis listing and school listing in table
d3.csv("overview.csv", function( directory ) {
	var columns = [], yAxis = [], key;

	// Gets all the names of the (first) object's (school's) attributes and
	// allocates them into either y-Axis array or column array (for sidebar)
  for ( key in directory[0] ) {
      if ( directory[0].hasOwnProperty(key)) {
      	if( key == 'DBN' || key == 'School Name' ) columns.push( key );
      	else if( $.inArray( key, excludes ) == -1 ) yAxis.push( key );
      }
  }

  // Add elements required for dropdown for y-axis, only one may be selcted
  appendToDropdown( "#y-axis", yAxis, function() {
		    $( "#y-axis li" ).removeClass( 'dropdownSelected' );
		    $( this ).addClass( 'dropdownSelected' );
		  } );

  // Add elements required for dropdown for school type, many may be selected
  appendToDropdown( "#school-type", schoolType, function() {
		    $( this ).toggleClass( 'dropdownSelected' );
		  } );

  var table = tabulate( directory, columns );
})

var appendToDropdown = function( ddID, ddArr, callFunction ){
	for( var i = 0; i < ddArr.length; i++ ){
		$( "<li/>", {
  		html: "<a href='#'>" + ddArr[i] + "</a>",
		  click: callFunction
		})
		  .appendTo( $(ddID) );
  }
}
