package feesmanagement;

import feesmanagement.server.SimpleServer;

/**
 * Main.java
 * Entry point of the School Fees Management System.
 * Starts the built-in HTTP web server on port 8080.
 * 
 * How to run:
 * 1. Compile: javac -cp .;mysql-connector-java-8.0.33.jar src/feesmanagement/Main.java
 * 2. Run:     java -cp .;mysql-connector-java-8.0.33.jar feesmanagement.Main
 * 3. Open:    http://localhost:8080 in your browser
 */
public class Main {
    
    public static void main(String[] args) {
        System.out.println("============================================================");
        System.out.println("         SCHOOL FEES MANAGEMENT SYSTEM");
        System.out.println("                MCA Mini Project");
        System.out.println("============================================================");
        
        // Test database connection first
        if (!DBConnection.testConnection()) {
            System.out.println("Failed to connect to database. Exiting...");
            System.out.println("Please check:");
            System.out.println("1. XAMPP is running (Apache and MySQL)");
            System.out.println("2. Database 'school_fees_db' exists");
            System.out.println("3. mysql-connector-java JAR is in classpath");
            return;
        }
        
        // Start the web server
        try {
            SimpleServer.start();
        } catch (Exception e) {
            System.out.println("Failed to start server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
 