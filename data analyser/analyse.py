# aa
import json
from pprint import pprint

allData = []

class dataLoader:

	jsonFileFolder = "../play scrapper /datajson/"
	maxJSONFiles = 279

	jsonFileIndex = -1
	arrayElementIndex = 0

	lastJsonRead = []

	def loadIthJSONFile(self , i):
		with open(self.jsonFileFolder + 'datai-'+str(i)+'.json') as data_file:
			data = json.load(data_file)
			self.lastJsonRead = data
			return data

	def getNext(self):
		if self.arrayElementIndex >= len(self.lastJsonRead) and self.jsonFileIndex >= self.maxJSONFiles:
			return None

		if self.arrayElementIndex >= len(self.lastJsonRead):
			self.jsonFileIndex += 1
			self.loadIthJSONFile(self.jsonFileIndex)
			self.arrayElementIndex = 0

		
		r =  self.lastJsonRead[self.arrayElementIndex]
		self.arrayElementIndex += 1
		return r

	def hasNext(self):
		if self.arrayElementIndex >= len(self.lastJsonRead) and self.jsonFileIndex >= self.maxJSONFiles:
			return False
		else:
			return True


d = dataLoader()

# d.getNext()   
# d.getNext()   
# d.getNext() 
# pprint (   d.getNext()   )

while d.hasNext() :
	allData.append(d.getNext())

print "done loading"





