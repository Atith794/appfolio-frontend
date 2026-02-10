export type TechCategory = "frontend" | "backend" | "database" | "infra" ;

//Proposed types to be included
// | "auth" | "iac" | "cont&orch" | "cicd" | "mo&ob" ;

export type TechItem = {
  id: string;          // stored in DB
  name: string;        // shown to user
  category: TechCategory;
  iconClass?: string;  // devicon class
};

export const TECH_CATALOG: TechItem[] = [
  // Frontend
  { id: "react-native", name: "React Native", category: "frontend", iconClass: "devicon-react-original" },
  { id: "react", name: "React", category: "frontend", iconClass: "devicon-react-original" },
  { id: "typescript", name: "TypeScript", category: "frontend", iconClass: "devicon-typescript-plain" },
  { id: "javascript", name: "JavaScript", category: "frontend", iconClass: "devicon-javascript-plain" },
  { id: "flutter", name: "Flutter", category: "frontend", iconClass: "devicon-flutter-plain colored" },
  { id: "swift", name: "Swift", category: "frontend", iconClass: "devicon-swift-plain colored" },
  { id: "kotlin", name: "Kotlin", category: "frontend", iconClass: "devicon-kotlin-plain colored" },
  { id: "java", name: "Java", category: "frontend", iconClass: "devicon-java-plain colored" },
  { id: "objectivec", name: "Objective C", category: "frontend", iconClass: "devicon-objectivec-plain colored" },
  { id: "dart", name: "Dart", category: "frontend", iconClass: "devicon-dart-plain colored" },
  { id: "csharp", name: "C #", category: "frontend", iconClass: "devicon-csharp-plain colored" },
  { id: "python", name: "Python", category: "frontend", iconClass: "devicon-python-plain colored" },
  { id: "ionic", name: "Ionic", category: "frontend", iconClass: "devicon-ionic-original colored" },
  { id: "angularjs", name: "Angular.js", category: "frontend", iconClass: "devicon-angularjs-plain colored" },
  { id: "php", name: "PHP", category: "frontend", iconClass: "devicon-php-plain colored" },
  { id: "expo", name: "Expo", category: "frontend", iconClass: "devicon-expo-original colored" },

  // Backend
  { id: "nodejs", name: "Node.js", category: "backend", iconClass: "devicon-nodejs-plain" },
  { id: "express", name: "Express.js", category: "backend", iconClass: "devicon-express-original" },
  { id: "fastify", name: "Fastify", category: "backend", iconClass: "devicon-fastify-plain" },
  { id: "supabase", name: "Supabase", category: "backend", iconClass: "devicon-supabase-plain colored" },
  { id: "nestjs", name: "Nest.js", category: "backend", iconClass: "devicon-nestjs-original colored" },
  { id: "django", name: "Django", category: "backend", iconClass: "devicon-django-original colored" },
  { id: "fastapi", name: "FastAPI", category: "backend", iconClass: "devicon-fastapi-original colored" },
  { id: "flask", name: "Flask", category: "backend", iconClass: "devicon-flask-original colored" },
  { id: "rubyonrails", name: "Ruby on Rails", category: "backend", iconClass: "devicon-rails-plain-wordmark colored" },
  { id: "laravel", name: "Laravel", category: "backend", iconClass: "devicon-laravel-original colored" },
  { id: "spring", name: "Spring Boot", category: "backend", iconClass: "devicon-spring-original-wordmark colored" },
  { id: "ktor", name: "Ktor", category: "backend", iconClass: "devicon-ktor-plain-wordmark colored" },
  { id: "dotnetcore", name: "Dotnet Core", category: "backend", iconClass: "devicon-dotnetcore-plain colored" },
  { id: "golang", name: "Go Lang", category: "backend", iconClass: "devicon-go-original-wordmark colored" },
  { id: "appwrite", name: "Appwrite", category: "backend", iconClass: "devicon-appwrite-original colored" },
  { id: "ionic", name: "Ionic", category: "backend", iconClass: "devicon-ionic-original colored" },
  { id: "firebase", name: "Firebase", category: "backend", iconClass: "devicon-firebase-plain-wordmark colored" },

  // Database
  { id: "postgresql", name: "PostgreSQL", category: "database", iconClass: "devicon-postgresql-plain" },
  { id: "mongodb", name: "MongoDB", category: "database", iconClass: "devicon-mongodb-plain" },
  { id: "redis", name: "Redis", category: "database", iconClass: "devicon-redis-plain" },
  { id: "firebasedb", name: "Firebase", category: "database", iconClass: "devicon-firebase-plain-wordmark colored" },
  { id: "dynamodb", name: "Dynamodb", category: "database", iconClass: "devicon-dynamodb-plain colored" },
  { id: "mysql", name: "MySQL", category: "database", iconClass: "devicon-mysql-original colored" },
  { id: "sqlite", name: "SQLite", category: "database", iconClass: "devicon-sqlite-plain colored" },
  { id: "realm", name: "Realm", category: "database", iconClass: "devicon-realm-plain colored" },
  { id: "couchbase", name: "Couchbase", category: "database", iconClass: "devicon-couchbase-original colored" },
  { id: "supabase", name: "Supabase", category: "database", iconClass: "devicon-supabase-plain colored" },
  { id: "microsoftsqlserver", name: "Microsoft SQL Server", category: "database", iconClass: "devicon-microsoftsqlserver-plain colored" },
  { id: "neo4j", name: "Neo4j", category: "database", iconClass: "devicon-neo4j-plain colored" },
  { id: "azuresqldatabase", name: "Azure Sql Database", category: "database", iconClass: "devicon-azuresqldatabase-plain colored" },
  { id: "cosmosdb", name: "Cosmos DB", category: "database", iconClass: "devicon-cosmosdb-plain colored" },

  // Infra
  { id: "aws", name: "AWS", category: "infra", iconClass: "devicon-amazonwebservices-plain-wordmark colored" },
  { id: "azure", name: "Azure", category: "infra", iconClass: "devicon-azure-plain colored" },
  { id: "googlecloud", name: "Google Cloud", category: "infra", iconClass: "devicon-googlecloud-plain-wordmark colored" },
  { id: "docker", name: "Docker", category: "cont&orch", iconClass: "devicon-docker-plain" },
  { id: "kubernetes", name: "Kubernetes", category: "cont&orch", iconClass: "devicon-kubernetes-plain" },

  // Containerisation and Orchestration
  // { id: "docker", name: "Docker", category: "cont&orch", iconClass: "devicon-docker-plain" },
  // { id: "kubernetes", name: "Kubernetes", category: "cont&orch", iconClass: "devicon-kubernetes-plain" },

  // Infra As Code (IAC)
  // { id: "terraform", name: "Terraform", category: "iac", iconClass: "devicon-terraform-plain colored" },
  // { id: "ansible", name: "Ansible", category: "iac", iconClass: "devicon-ansible-plain colored" },

  // CI & CD
  // { id: "githubactions", name: "Github Actions", category: "cicd", iconClass: "devicon-githubactions-plain colored" },
  // { id: "jenkins", name: "Jenkins", category: "cicd", iconClass: "devicon-jenkins-line colored" },
  // { id: "xcode", name: "X Code", category: "cicd", iconClass: "devicon-xcode-plain colored" },
  // { id: "gitlab", name: "Gitlab", category: "cicd", iconClass: "devicon-gitlab-plain colored" },
  // { id: "bitbucket", name: "Bitbucket", category: "cicd", iconClass: "devicon-bitbucket-original colored" },

  // Monitoring & Observability
  // { id: "prometheus", name: "Prometheus", category: "mo&ob", iconClass: "devicon-prometheus-original colored" },
  // { id: "grafana", name: "Grafana", category: "mo&ob", iconClass: "devicon-grafana-plain colored" },
  // { id: "datadog", name: "Datadog", category: "mo&ob", iconClass: "devicon-datadog-original colored" },

  //Auth
  // { id: "firebaseauth", name: "Firebase Auth", category: "auth", iconClass: "devicon-firebase-plain-wordmark colored" },
  // { id: "oauth", name: "O Auth", category: "auth", iconClass: "devicon-oauth-plain colored" },
  // { id: "supabaseauth", name: "Supabase Auth", category: "backend", iconClass: "devicon-supabase-plain colored" },
  
];