# Minister Connect Documentation

This directory contains documentation for the Minister Connect application.

## Diagrams

### Use Case Diagram

The Use Case Diagram shows the three main user types (Candidate, Church, Admin) and their interactions with the system.

![Use Case Diagram](./usecase_diagram.png)

- **Source**: `use-case-diagram.puml` - PlantUML source code
- **Generated**: `usecase_diagram.png` - Generated diagram image

#### How to regenerate the diagram:

1. **Online (Recommended)**: Copy the contents of `use-case-diagram.puml` and paste it into [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)

2. **Local (requires Java + PlantUML)**:
   ```bash
   # Install PlantUML (requires Java)
   npm install -g plantuml
   
   # Generate diagram
   plantuml -tpng docs/use-case-diagram.puml
   ```

3. **VS Code Extension**: Install the "PlantUML" extension and open the `.puml` file

### Database Schema Diagram

The Database Schema Diagram shows the complete data model and relationships between entities.

![Database Schema](./db_diagram.png)

- **Source**: Generated using [dbdiagram.io](https://dbdiagram.io/)
- **Generated**: `db_diagram.png` - Generated diagram image

#### Database Schema Definition:

```sql
-- Use DBML to define your database structure
-- Docs: https://dbml.dbdiagram.io/docs

Table users {
  id integer [primary key]
  email varchar
  password varchar
  role varchar
  church_id integer [ref: > churches.id] // many-to-one, null for applicant and admin
  created_at timestamp
  updated_at timestamp
}

Table churches {
  id integer [primary key]
  name varchar
  email varchar
  phone varchar
  website varchar
  street_address varchar
  city varchar
  state varchar
  zipcode varchar
  status varchar
  created_at timestamp
  updated_at timestamp
}

Table invite_codes {
  id integer [primary key]
  code varchar
  event varchar
  uses integer
  status varchar
  created_at timestamp
  updated_at timestamp
}

Table profiles {
  id integer [primary key]
  first_name varchar
  last_name varchar
  email varchar
  user_id integer [ref: - users.id]
  invite_code_id integer [ref: <> invite_codes.id]
  street_address varchar
  city varchar
  state varchar
  zipcode varchar
  status varchar // draft, pending, approved, rejected
  photo bytea
  resume bytea
  video_url varchar
  placement_preferences varchar[]
  created_at timestamp
  updated_at timestamp
}

Table job_listings {
  id integer [primary key]
  church_id integer [ref: > churches.id]
  title varchar
  ministry_type varchar
  employment_type varchar
  job_posting_url varchar
  created_at timestamp
  updated_at timestamp
}

Table mutual_interests {
  id integer [primary key]
  job_listing_id integer [ref: > job_listings.id]
  profile_id integer [ref: > profiles.id]
  expressed_by varchar // user/candidate or user/organization
  expressed_by_user_id integer [ref: > users.id]
  created_at timestamp
  updated_at timestamp
}

Table password_resets {
  id integer [primary key]
  user_id integer [ref: > users.id]
  reset_by integer [ref: > users.id]
  reset_token_hash varchar
  expires_at timestamp
  used boolean
  created_at timestamp
}
```

## Documentation Files

- `use-case-diagram.puml` - PlantUML source code for the use case diagram
- `usecase_diagram.png` - Generated use case diagram
- `db_diagram.png` - Generated database schema diagram
- `README.md` - This documentation file

## Notes

- Update diagram source code when making changes to the application's user flows or data model
- Regenerate images whenever the source code is updated
- Both diagrams use consistent "churches" terminology to match the application domain
