using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using UEFGallery.API.Data;
using UEFGallery.API.Models;

class Program
{
    static void Main()
    {
        var options = new DbContextOptionsBuilder<GalleryDbContext>()
            .UseSqlite("Data Source=../UEFGallery.API/gallery.db")
            .Options;
            
        using var context = new GalleryDbContext(options);
        
        try
        {
            var artwork = context.Artworks.FirstOrDefault();
            var badge = context.Badges.FirstOrDefault();
            
            if (artwork == null || badge == null) {
                Console.WriteLine("No artwork or badge found");
                return;
            }
            
            Console.WriteLine($"Assigning badge {badge.Id} to artwork {artwork.Id}");
            
            var newAb = new ArtworkBadge
            {
                BadgeId = badge.Id,
                ArtworkId = artwork.Id,
                AssignedAt = DateTime.UtcNow
            };
            
            context.ArtworkBadges.Add(newAb);
            context.SaveChanges();
            Console.WriteLine("Success!");
        }
        catch (Exception e)
        {
            Console.WriteLine("ERROR DETAILS:");
            Console.WriteLine(e.ToString());
        }
    }
}
