import java.lang.Math;
public class Long_and_Lat_Original1 {
	//Declaring the common variables
	public static double NorthMostLat = 47.734143;
	public static double SouthMostLat = 47.477984;
	//the yelp radius
	public static double mileRadius = 0.1;
	public static double earth_radius = 3960.0;
	public static double degrees_to_radians = Math.PI/180.0;
	public static double radians_to_degrees = 180.0/Math.PI;
	public static int widthOfSeattleMiles = 10;
	//Farthest longitude to the East
	public static double startingLong = 122.260245;

	public static void main(String[] args) {
		//Calculates the number of Longs based on yelp Radius
		int numberOfLongs = (int) Math.round(widthOfSeattleMiles/mileRadius);
		//Calculates the latitude distance based on the yelp Radius
		double rMileLat = (mileRadius/earth_radius)*radians_to_degrees;
		int numberOfLats = (int) Math.round((NorthMostLat - SouthMostLat ) / rMileLat);
		System.out.println(numberOfLats);
		double[] allLatValues = new double [numberOfLats + 1];


		// Inserts all the Lats into an array
		for(int i = 0; i < numberOfLats + 1; i++){ 
	         allLatValues[i] =  47.477984 + (rMileLat * i);
	         //System.out.println(allLatValues[i]);	
	    }
	         
		//Calculates the new Long based on the Lat and prints it out
		for(int j = 0; j < numberOfLats + 1 ; j++){
			startingLong = 122.260245;
			
            for(int i = 0; i < numberOfLongs ; i++){             	
            	startingLong = startingLong + change_in_longitude(allLatValues[j], (mileRadius));
            	
               System.out.println(allLatValues[j] + ", -" + startingLong);
            }
		}
            
   }
   
	// Calculates the change in longitude based on the Latitude
   public static double change_in_longitude(double latitude, double miles){
   
	    double r = earth_radius * Math.cos(latitude * degrees_to_radians);
	    
	    return (miles/r)*radians_to_degrees;
   }

}


   

 