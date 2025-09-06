// version: "3.9"
// services:
//     backend:
//         build: ../TanHung_Backend
//         container_name: node-backend
//         restart: always
//         ports:
//             - "8080:8080"
//         env_file: ../TanHung_Backend/.env
//         depends_on:
//             - mysql-db

//     mysql-db:
//         image: mysql:8.0
//         container_name: mysql-db
//         restart: always
//         environment:
//             MYSQL_ROOT_PASSWORD: 123456
//             MYSQL_DATABASE: tanhung_general_hospital_db
//         ports:
//             - "3307:3306"
//         volumes:
//             - mysql_data:/var/lib/mysql

//     frontend:
//         build: .
//         container_name: react-frontend
//         restart: always
//         ports:
//             - "3000:80"
//         depends_on:
//             - backend

// volumes:
//     mysql_data:
