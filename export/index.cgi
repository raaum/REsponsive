#!/usr/bin/perl

my %INPUT;

&parse_form;

# change url to local file url if "full" type


my $debug = 0;

if ($debug) {
  print "Content-type: text/html\n\n";
  print "<html><head><title></title></head><body>width: $width<br>height: $height<br>url: $url<br></body></html>";
}

&phantom_export;


######################################################################################################################
# PHANTOM EXPORT
# make a system call to phantomjs to generate our image file, copy the file to standard output and send it to the 
# browser for download
######################################################################################################################
sub phantom_export {

  $width = $INPUT{'width'};
  $height =  $INPUT{'height'};
  $url =  $INPUT{'url'};
  $type = $INPUT{'type'};
  $filename = $url;
  $js = "generate.js";

  $filename =~ s,http:,,g;
  $filename =~ s,www.,,g;
  $filename =~ s,//,,g;
  $filename =~ s/\./_/g;
  $filename =~ s/\//_/g;
  $filename =~ s/^\s+//g;
  $filename =~ s/\s+$//g;
  $filename =~ s/ //g;
  $filename =~ s/['\$','\#','\@','\~','\!','\&','\*','\(','\)','\[','\]','\;','\.','\,','\:','\?','\^',' ', '\`','\\','\/']//g;
  $filename .= "_" . $width . "x" . $height . ".png";

  $filepath = "./exports/" . $filename;

  if ($type eq "full") { $js = "viewport.js"; }

  my $phantom = `phantomjs "$js" "$url" "$filepath" "$width" "$height"`;

	if (-e $filepath) {
		chmod(0777, $filepath);
		my ($image, $buff) = "";
		print ("Content-Type: image/png\n");
		print "Content-Disposition: attachment; filename=$filename\n\n";

		open IMAGE, "$filepath";
		binmode IMAGE;
		while (read IMAGE, $buff, 1024) { $image .= $buff; }
		close IMAGE;

		print $image;
		unlink $filepath;
	}
	else {
		print "Content-type: text/html\n\nUnable to generate image.  Something went wrong. Try again in a minute.\n\n";
		unlink $filepath;
	}  

  #http://vs10.portal.frogdesign.com/responsive/export/?url=http://www.cnn.com&width=450&height=500

}

######################################################################################################################
# PARSE FORM
######################################################################################################################
sub parse_form {

  my $input = $ENV{QUERY_STRING};

  my @pairs = split(/&/, $input);

  foreach my $pair (@pairs) {
    my ($name, $value) = split(/=/, $pair);
    $value =~ tr/+/ /;
    $value =~ s/%([a-fA-F0-9][a-fA-F0-9])/pack("C", hex($1))/eg;
    $INPUT{$name} = $value;
  }
}

exit;