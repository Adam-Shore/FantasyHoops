import time
import requests
import re
import json
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException  # Import the TimeoutException class

def get_soup(url):
    response = requests.get(url)
    response.raise_for_status()  # Check for any errors in the request
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup


def extract_player_name(player_name_cell_html):

    # Handle empty or None input
    if not player_name_cell_html:
        return None, None

    soup = BeautifulSoup(player_name_cell_html, 'html.parser')

    # Find player name using CSS selector
    player_name_match = soup.select_one('a.AnchorLink')
    player_name = player_name_match.text.strip() if player_name_match else None

    # Find team using CSS selector
    team_match = soup.select_one('span.pl2.n10.athleteCell__teamAbbrev')
    team = team_match.text.strip() if team_match else None

    # Check if the player name is None or an empty string
    if player_name is None or player_name == '':
        return None, team

    return player_name, team


def extract_player_data(player_data_entry_html):
    soup = BeautifulSoup(player_data_entry_html, 'html.parser')
    # Check if the position element exists before accessing its text
    position_element = soup.find('td', class_='position Table__TD')
    position = position_element.text.strip() if position_element else None
    if position is None:
        return

    # Extract stats based on positional order
    stats = {}
    stat_elements = soup.find_all('td', class_='Table__TD')
    if len(stat_elements) >= 17:  # Assuming there are at least 17 stat elements
        stats['games_played'] = int(stat_elements[1].text.strip())
        stats['minutes_per_game'] = float(stat_elements[2].text.strip())
        stats['points_per_game'] = float(stat_elements[3].text.strip())
        stats['field_goals_made_per_game'] = float(stat_elements[4].text.strip())
        stats['field_goals_attempted_per_game'] = float(stat_elements[5].text.strip())
        stats['field_goal_percentage'] = float(stat_elements[6].text.strip())
        stats['three_pointers_made_per_game'] = float(stat_elements[7].text.strip())
        stats['three_pointers_attempted_per_game'] = float(stat_elements[8].text.strip())
        stats['three_point_percentage'] = float(stat_elements[9].text.strip())
        stats['free_throws_made_per_game'] = float(stat_elements[10].text.strip())
        stats['free_throws_attempted_per_game'] = float(stat_elements[11].text.strip())
        stats['free_throw_percentage'] = float(stat_elements[12].text.strip())
        stats['rebounds_per_game'] = float(stat_elements[13].text.strip())
        stats['assists_per_game'] = float(stat_elements[14].text.strip())
        stats['steals_per_game'] = float(stat_elements[15].text.strip())
        stats['blocks_per_game'] = float(stat_elements[16].text.strip())

    return {
        'position': position,
        **stats,  # Unpack the stats dictionary
        # Add other data fields here
        # ...
    }

def extract_player_name(player_entry):
    soup = BeautifulSoup(player_entry, 'html.parser')

    # Find player name using CSS selector
    player_name_match = soup.select_one('a.AnchorLink')
    player_name = player_name_match.text.strip() if player_name_match else None

    # Find team using CSS selector
    team_match = soup.select_one('span.pl2.n10.athleteCell__teamAbbrev')
    team = team_match.text.strip() if team_match else None

    player_id = None
    if player_name_match:
        player_href = player_name_match.get('href')
        match = re.search(r'/id/(\d+)/', player_href)
        if match:
            player_id = match.group(1)

    # Check if the player name is None or an empty string
    if player_name is None or player_name == '':
        return None


    imagelink = "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/%s.png&w=350&h=254" % (player_id)

    player_data = {
        'name': player_name,
        'team': team,
        'playerid': player_id,
        'imagelink': imagelink
        # Add other data fields here
        # ...
    }
    return player_data



def fetch_all_player_data(url):
    player_data_list = []
    driver = webdriver.Chrome()
    driver.get(url)
    # Wait for the "Show More" button to be visible
    wait = WebDriverWait(driver, 10)
    try:
        while True:
            show_more_button = wait.until(
                EC.presence_of_element_located((By.XPATH, "//a[@class='AnchorLink loadMore__link']")))
            driver.execute_script("arguments[0].click();", show_more_button)
            time.sleep(2)  # Wait a few seconds for the data to load, adjust as needed
    except TimeoutException:
        # If TimeoutException occurs, it means the "Show More" button is no longer visible, and we can continue with scraping
        pass
    # Load the webpage and extract player entries
    page_source = driver.page_source

    # Load the webpage and extract player entries
    soup = BeautifulSoup(page_source, 'html.parser')
    player_entries = soup.find_all('tr', class_='Table__TR Table__TR--sm Table__even')

    all_player_stats = []
    player_entry = soup.find_all('tr', class_='Table__TR')  # Adjust the class name according to the website structure
    for p in player_entry:
        player_stats = extract_player_data(str(p))
        all_player_stats.append(player_stats)

    # Extract data for each player
    for player_entry in player_entries:
        player_data = extract_player_name(str(player_entry))
        if player_data is not None:
            player_data_list.append(player_data)
    return player_data_list, all_player_stats

def main():
    url = 'https://www.espn.com/mens-college-basketball/stats/player'  # Replace with the actual URL
    all_player_data = fetch_all_player_data(url)

    all_player_data = [player_data for player_data in all_player_data]

    # Save the data to a JSON file
    with open('input_file.json', 'w') as json_file:
        json.dump(all_player_data, json_file, indent=2)

    with open('input_file.json') as f:
        data = json.load(f)
    # Get the players' info from the first list
    players_info = data[0]
    # Get the players' stats from the second list
    players_stats = data[1]
    # Remove null entries from players_stats
    players_stats = [entry for entry in players_stats if entry is not None]
    # Combine the player info and stats into a single dictionary
    combined_data = []
    for info, stats in zip(players_info, players_stats):
        if info is not None and stats is not None:
            player_data = {**info, **stats}
            combined_data.append(player_data)

    sorted_data = sorted(combined_data, key=lambda x: x.get('name', '').lower())

    for idx, player in enumerate(sorted_data, start=1):
        player['local_player_id'] = idx

    # Create a new JSON object with the combined data
    result_json = {"PlayerData": sorted_data}

    # Save the result to a new JSON file
    with open('output.json', 'w') as f:
        json.dump(result_json, f, indent=2)

if __name__ == "__main__":
    main()