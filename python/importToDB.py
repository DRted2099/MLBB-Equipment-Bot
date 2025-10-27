import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
print(basedir)
dotenv_path = os.path.join(basedir, '.env')

# --- Step 1: Explicitly load the environment variables ---
load_dotenv(dotenv_path)

# --- Step 2: Access the credentials ---
user = os.environ.get("DB_USER")
password = os.environ.get("DB_PASS")
host = os.environ.get("DB_HOST")
port = os.environ.get("DB_PORT")
db_name = os.environ.get("DB_NAME")

print("Loaded variables:", user, password, host, port, db_name)

# --- Step 3: Add error handling for missing variables ---
if not all([user, password, host, port, db_name]):
    raise ValueError("Missing one or more database environment variables. Check your .env file.")

# --- Step 4: Create the database URL with the correct syntax ---
# The db_url format needs to include the database driver, e.g., 'postgresql+psycopg2'.
db_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"

# --- Step 5: Create the engine ---
engine = create_engine(db_url)

# folder_path = 'stats'
folder_path = 'equipment data raw'
i = 0
for file in os.listdir(folder_path):
    
    if file.endswith('.csv'):
        file_path = os.path.join(folder_path, file)
        table_name = os.path.splitext(file)[0]
        
        df = pd.read_csv(file_path)
        i+=1
        print(i)

        df.to_sql(
            table_name,  # Use the variable 'table_name', not the string 'file_name'
            con=engine, 
            if_exists='replace',
            index=False
        )
        
        print(f"Successfully imported {file} into table '{table_name}'.")
