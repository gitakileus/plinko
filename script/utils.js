const fs = require('fs')

exports.makeArray = async (req, res) => {
	const { line, xpos, target } = req.body
	console.log(`line: ${line}, xpos: ${xpos}, target: ${target}`)
	let rawData = fs.readFileSync('./script/target.json')
	let targetArray = JSON.parse(rawData)
	targetArray[line / 4 - 2][target].push(xpos)
	fs.writeFileSync('./script/target.json', JSON.stringify(targetArray))
  res.status(200).send('success');
}
