# aa
import json
from pprint import pprint


jsonFileFolder = "../play scrapper/datajson/"
maxJSONFiles = 100

def loadIthJSONFile(i):
	with open(jsonFileFolder + 'data'+str(i)+'.json') as data_file:
		data = json.load(data_file)
		return data



for i in range(maxJSONFiles):
	pprint ( loadIthJSONFile(i)  )