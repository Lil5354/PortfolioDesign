FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["UEFGallery.API/UEFGallery.API.csproj", "UEFGallery.API/"]
RUN dotnet restore "UEFGallery.API/UEFGallery.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/UEFGallery.API"
RUN dotnet build "UEFGallery.API.csproj" -c Release -o /app/build
RUN dotnet publish "UEFGallery.API.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "UEFGallery.API.dll"]
