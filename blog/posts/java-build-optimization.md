---
title: "Optimising Java Build Performance: From 8 Hours to 30 Minutes"
description: "How refactoring a legacy Maven build reduced developer setup time by 96% and improved security scanning coverage"
date: "2025-01-05"
readTime: 6
tags: "java,maven,performance,devops,security"
slug: "java-build-optimisation"
---

# Optimising Java Environment Setup: From Days to 30 Minutes

One of the most impactful projects during my platform engineering internship was refactoring a legacy Java Maven build. What started as a "quick cleanup"to enable security scanning for a project turned into a comprehensive optimisation that reduced developer environment setup time from a full day to under 30 minutes.

## The Problem

The legacy project had accumulated years of technical debt:

- **Lenghty setup time**: New developers needed an entire day to get a working environment
- **Security blind spots**: No automated vulnerability scanning, with some old dependencies in place.
- **Inconsistent environments**: "Works on my machine" was a daily occurrence

This wasn't just a technical problem, it was actively hurting team productivity and onboarding new engineers.

## Investigation and Analysis

### Profiling the Build

First, I needed to understand where the time was being spent. The actual Maven build itself wasn't time consuming, it was the environment that needed to be set up _around_ the build to enable it to work. 

```bash
./mvnw clean package # Only took around 5 minutes, not bad for legacy code!
```

Dependencies being stored in a modern package registry being pulled by legacy Java running TLS v1.0 was kicking up a fuss. Previous developers had configured a method for setting up an enviroment to solve this problem, but I wanted to focus on a containerised approach. This would allow us to build the project in Gitlab CI and complete our security scanning. 

### TLS Crash Coursing

The Java version being used had reached EOL, and as such, it was not using TLS v1.0, which was not supported by our package registry for communications. 

## Dockerising a Solution

A solution in a Docker container has two benefits:

1. We could stand up a build and an environment in CI. Our runners could set up an ephemeral environment to build the project, and perform some security analysis on a dynamic environment. 
2. Crucially, a **local development environment** could be defined as code. A 5 page Confluence doc with step-by-step ClickOps can be replaced by a `docker-compose` command.

With this thinking in mind, I started writing Dockerfiles to get a build working in Docker. A review of our network diagrams and our internal package registry guided me around the TLS headaches, and a (closed-source) solution was configured _without_ the need for a reverse proxy. 

With that, dependencies could be pulled across the network. JARs were now successfully building, meaning that our security analysis could be completed, and the local dev environment had its first legs. I then handed over to one of the developers on the team, who was able to use my methodology to get their DBs and Tomcat servers set up using `docker-compose`, and just like that, a local environment could be kicked off with ease!

## Results and Impact

The refactoring delivered significant improvements:

### Performance Gains
- **Setup time**: 8 hours → 30 minutes (96% reduction)

### Security Improvements
- **Vulnerability detection**: Identified some critical CVEs
- **Automated scanning**: Security checks on every build
- **Dependency updates**: Automated security notifications to SDMs.

### Developer Experience
- **Consistent environments**: Docker eliminated environment differences
- **Faster feedback**: Quicker build times enabled faster iteration
- **Better onboarding**: New developers productive on day one

## Lessons Learned

### 1. Profile Before Optimising

Don't guess where the bottlenecks are—measure them:

```bash
# Maven timing plugin
mvn clean install -Dtime

# JVM profiling for tests
mvn test -Djvm.args="-XX:+PrintGCDetails -XX:+PrintGCTimeStamps"
```

### 2. Security Can't Be an Afterthought

Integrating security scanning into the build process caught issues that manual reviews missed. The key is making it fast enough that it is not a bottleneck in the pipeline that will get manually overriden out of frustration.

### 3. Documentation is Critical

No matter how elegant your solution, it's useless if the team doesn't understand how to use it. I spent 20% of my time on documentation and training.

### 4. Containerisation Solves Real Problems

Docker goes far beyond just a buzzword here, it solved actual pain points around environment consistency and onboarding.

## Conclusion

This project reinforced that performance optimisation is often about identifying and eliminating waste rather than adding complexity. By focusing on the fundamentals, we achieved dramatic improvements that paid dividends every day.

The security improvements were an unexpected bonus that probably saved the company from future incidents. Sometimes the best security fixes are the ones that prevent problems you never knew you had.

---
