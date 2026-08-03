FROM gradle:8.4-jdk11 AS builder
WORKDIR /build

COPY . /build
RUN gradle bootJar -x test --no-daemon

FROM eclipse-temurin:11-jre-alpine
WORKDIR /app
COPY --from=builder /build/build/libs/*.jar ./app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
