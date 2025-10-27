import pandas as pd
import os
import re

folder_path = 'equipment data raw'
dict_list_keys = []

for file in os.listdir(folder_path):

    if file.endswith('.csv'):
        file_path = os.path.join(folder_path, file)
        file_name = os.path.splitext(file)[0]
       

    df = pd.read_csv(file_path)

    # -- Creating a new list using .split() on the string in the "Stat" column
    # -- The delimiter used is "+" for the .split()"
    # -- Data in stat column looks like this:
    # -- +45 Adaptive Attack+400 HP+5% Cooldown Reduction

    df['Stat'] = df['Stat'].astype(str)
    # print(df['Stat'])

    # for index, item in enumerate(df['Stat']):
    #     print(f"Value: {item}, Type: {type(item)}")
    #     print(index)

    # stat_list = [x.split('+') if x else ['0'] for x in df['Stat']]
    stat_list = [x.split('+') for x in df['Stat'] if x]
    # print(stat_list)
 

    # -- Removing the empty string in stat_list which occurs because of the 
    # -- "+" at the beginning of the string

    remove_blank = [] # -- temporary list to store the array
    stat_list_clean = [] # -- Final list consisting of the arrays without blank strings

    # -- Using the index and and the elements  
    for i in range(len(stat_list)): 
        for j in range(len(stat_list[i])): 

            # --  stat_list[i][j] checks if there is an element, if there is no element it returns False
            # --  stat_list[i][j].strip()  to check for empty strings (aka strings with only white-spaces) if its a blank string it returns False

            if stat_list[i][j] and stat_list[i][j].strip():

                remove_blank.append(stat_list[i][j])

        stat_list_clean.append(remove_blank)
        remove_blank = []
    # print(stat_list_clean)

    # -- Further splitting the strings in the array to separate the numbers from the text
    stat_num_name = []

    for i in range(len(stat_list_clean)):

        list_temp_stat_name_num = []

        for j in range(len(stat_list_clean[i])):

            split_num = re.split(r'(\d+)', stat_list_clean[i][j]) #Splitting the string at the numbers and returning both the numbers and words   
            stat_split = [x.strip() for x in split_num if x] #Removing empty strings and whitespace

            list_temp_stat_name_num.append(stat_split) #Appending the split strings to a temporary list
            
            
        stat_num_name.append(list_temp_stat_name_num) #Appending the temporary list to the final list
        

    # -- Reversing the order of the elements in the inner lists to have the stat name first and the number second
    # -- PS THE BELOW LINE PF CODE IS WHY THERE IS A STATUS COLUMN WITH INVALID - (ONLY FOR THE POTIONS)
    dict_list = [dict(reversed(pair) for pair in item) if item != [['nan']] else {'status': 'invalid'} for item in stat_num_name]
    
    

    # for item in dict_list:
    #     dict_list_keys.append(item.keys())

            
    # print(dict_list)

    stat_table = pd.DataFrame(dict_list)
    stat_table.to_csv(f"stats/Stats_{file_name}.csv", index=False)

# dict_list_keys = set().union(*dict_list_keys)
# print(dict_list_keys)
   