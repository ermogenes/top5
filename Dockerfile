FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /appsource
COPY . .
RUN dotnet publish -c Release -o ./release

FROM mcr.microsoft.com/dotnet/aspnet:3.1
WORKDIR /app
COPY --from=build /appsource/release .
EXPOSE 80
ENTRYPOINT [ "dotnet", "/app/top5.dll" ]
