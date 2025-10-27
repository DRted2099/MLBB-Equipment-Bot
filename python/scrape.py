from bs4 import BeautifulSoup
import pandas as pd

with open('ML_Equip.html', 'r', encoding='utf-8') as file:

    soup = BeautifulSoup(file, 'lxml')

# print(soup.prettify())

# -- Function to scrape equipment data based on equipment type
# -- Takes a string argument called equip_type (Attack, Magic etc) 
# -- Generates a CSV file with the equipment data
def equip_table(equip_type: str):

    # --bType checking
    if not isinstance(equip_type, str):
        raise TypeError("equip_type must be a string")
    
    # -- Initialize lists to store data
    name, cost, stat, type, passive_desc, img = [], [], [], [], [], []

    # -- Looping through each equipment and saving data to respective lists
    for index, item in enumerate(soup.find_all(attrs = {"data-type":equip_type})):

        name.append(item.h3.text) # Name of the equipment
        cost.append(item.p.text) # Cost of the equipment
        stat.append(item.find('div',class_="text-mint-400").text) # Stat of the equipment
        type.append(item.find('div',class_="text-right").text) # Type of the equipment
        img.append(item.find('img')['src'])
    
        # -- Passive description of the equipment
        # -- Split data based on "Unique" or "Active" keywords
        temp_passive = item.find('div', class_="text-[13px] text-neutral-300 text-left px-1").text
        before_u, separator_u, after_u = temp_passive.partition('Unique')
        before_a, separator_a, after_a = temp_passive.partition('Active')

        if separator_u:
            
            if 'Unique' in after_u:
                print('replaced', name[index])
                after_u.replace("Unique", " Unique").replace("  ", " ").strip()
            
            passive_desc.append(separator_u + after_u)

        elif separator_a:
            passive_desc.append(separator_a + after_a)

        else:
            # passive_desc.append(temp_passive)
            passive_desc.append("No passive")

    # -- Create a DataFrame and save to CSV
    
    df = pd.DataFrame({'Name':name, 'Cost':cost, 'Type':type, 'Stat':stat, 'Passive_Desc':passive_desc, 'Image':img})
    df.to_csv(f"equipment data raw/ML_Equip_{equip_type.lower()}.csv", index=False)


# -- Get all unique data-type values
x = soup.find_all(attrs = {"data-type":True})

# -- Initialize a set to store unique data-type values
unique_data_types = set()

# -- Extract unique data-type values
for tags in x:
    data_type_values = tags.get('data-type')
    unique_data_types.add(data_type_values)


# -- Generate CSV files for each unique data-type
for equip in unique_data_types:
    equip_table(equip)

