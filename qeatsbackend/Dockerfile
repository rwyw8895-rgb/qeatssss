FROM maven:3.9.9-eclipse-temurin-11 AS builder
WORKDIR /build

COPY qeatsbackend/pom.xml ./
COPY qeatsbackend/src ./src
RUN mvn -B -Dmaven.test.skip=true package

FROM eclipse-temurin:11-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/qeatsbackend-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
