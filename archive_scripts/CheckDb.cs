using System;
using Npgsql;

class Program
{
    static void Main()
    {
        var connString = "Host=ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_0ItvywJCB4RX;Ssl Mode=Require;Trust Server Certificate=true;";
        using var conn = new NpgsqlConnection(connString);
        conn.Open();

        using var cmd = new NpgsqlCommand(@"
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        ", conn);

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            Console.WriteLine($"{reader.GetString(0)} - {reader.GetString(1)}");
        }
    }
}
