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
            using var cmd1 = new NpgsqlCommand("ALTER TABLE \"artworks\" ADD COLUMN \"original_cover_url\" text NULL;", conn);
            cmd1.ExecuteNonQuery();
            Console.WriteLine("Added original_cover_url to artworks");
        } catch (Exception e) {
            Console.WriteLine("Artworks error: " + e.Message);
        }

        try {
            using var cmd2 = new NpgsqlCommand("ALTER TABLE \"messages\" ADD COLUMN \"status\" text NULL;", conn);
            cmd2.ExecuteNonQuery();
            Console.WriteLine("Added status to messages");
        } catch (Exception e) {
            Console.WriteLine("Messages error: " + e.Message);
        }
    }
}
