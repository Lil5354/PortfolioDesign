using System;
using Npgsql;

class Program
{
    static void Main()
    {
        var connString = "Host=ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_0ItvywJCB4RX;Ssl Mode=Require;Trust Server Certificate=true;";
        using var conn = new NpgsqlConnection(connString);
        conn.Open();

        try {
            using var cmd = new NpgsqlCommand("SELECT id, email, role FROM users WHERE role='lecturer'", conn);
            using var reader = cmd.ExecuteReader();
            while(reader.Read()) {
                Console.WriteLine($"Found Lecturer: ID={reader.GetString(0)}, Email={reader.GetString(1)}");
            }
        } catch (Exception e) {
            Console.WriteLine("Error: " + e.Message);
        }
    }
}
