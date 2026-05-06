DROP TABLE IF EXISTS visits;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS insurance;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS appointment_status;
DROP TYPE IF EXISTS user_role;


CREATE TYPE user_role AS ENUM ('doctor', 'admin', 'frontoffice');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email TEXT UNIQUE  NOT NULL ,
    password_hash VARCHAR(60) NOT NULL,
    role user_role NOT NULL
);

CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    NPI VARCHAR(10) NOT NULL,
    speciality VARCHAR(20),
    user_id INT REFERENCES users(user_id) NOT NULL
);

CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email TEXT UNIQUE  NOT NULL ,
    dob DATE NOT NULL,
    Address VARCHAR(40) NOT NULL,
    mobile_phone VARCHAR(10) NOT NULL,
    hoeme_phone VARCHAR(10) NOT NULL,
    marriage_status VARCHAR(10) NOT NULL,
    title VARCHAR(10) NOT NULL,
    social_security VARCHAR(10) NOT NULL,
    emergency_contact VARCHAR(50) NOT NULL

);

CREATE TABLE cases (
    case_id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL,
    referring_dr VARCHAR(50) NOT NULL,
    patient_id INT REFERENCES patients(patient_id) NOT NULL
   
);

CREATE TABLE insurance (
    insurance_id SERIAL PRIMARY KEY,
    insurance_name VARCHAR(50) NOT NULL,
    member_id VARCHAR(50) NOT NULL,
    group_number VARCHAR(50) NOT NULL,
    subscriber_name VARCHAR(50) NOT NULL,
    subscriber_relationship VARCHAR(50) NOT NULL,
    case_id INT REFERENCES cases(case_id) NOT NULL

);

CREATE TYPE appointment_status AS ENUM ('arrived', 'cancelled', 'cancelled_without_notice', 'no_call_no_show', 'scheduled', 'rescheduled');

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    appointment_date DATE NOT NULL,
    appointment_starttime TIME NOT NULL,
    appointment_endtime TIME NOT NULL,
    status appointment_status NOT NULL,
    patient_id INT REFERENCES patients(patient_id) NOT NULL,
    case_id INT REFERENCES cases(case_id) NOT NULL,
    doctor_id INT REFERENCES doctors(doctor_id) NOT NULL
    
);

CREATE TABLE visits (
    visit_id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES appointments(appointment_id) NOT NULL,
    visit_date DATE NOT NULL,
    vitals VARCHAR(50),
    notes VARCHAR(500),
    case_id INT REFERENCES cases(case_id) NOT NULL,
    doctor_id INT REFERENCES doctors(doctor_id) NOT NULL,
    patient_id INT REFERENCES patients(patient_id) NOT NULL
);