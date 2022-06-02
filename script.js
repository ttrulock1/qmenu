
/*

===== INSTRUCTIONS =====

Write a function that takes in (a) an order object and (b) a new transaction amount, and returns a modified order object.
- If new transaction amount is positive, it's a new charge.
- If new transaction amount is negative, it's a new refund.

An order object contains:
- An array of 1 or more charges. (Each charge object has an id and an amount)
- An array of 0 or more refunds. (Each refund object has a charge_id (the id of the charge that the refund is fully or partially refunding), and an amount (the size of the refund))

YOUR GOAL: For each charge, there is a flat processing fee of $0.30, so we want to minimize how many times we incur this fee. Only by "reversing" (fully refunding) a charge can we recoup this $0.30 fee. That means whenever a new refund transaction comes in, we want to maximize the number of individual charges over which we "spread" that refund amount to cancel out as many individual charges as possible, and thereby get back the most fees.
CONSTRAINTS: We can't just reverse an old charge and process a new charge equivalent to the new total. (For example, if the original charge was $25, and the restaurant later wants to charge $2 more, we can't just refund the original $25 charge and then process a new $27 charge).
NOTE: Charges can only be "reversed" by getting FULLY refunded. Refunds cannot be reversed.

[OPTIONAL - ONLY LOOK AT THIS IF YOU COMPLETED THE MAIN ALGORITHM FIRST!] Additional consideration: Since the minimum possible fee for a transaction is $0.30, we will still incur this fee unless the transaction is fully refunded, which means that if we refunded $0.80 of a $1 transaction, we would actually be worse off than if we had just refunded the full $1 (-$0.80-$0.30 = -$1.10). How should we handle this? And what if there are future refunds or charges? What new piece of data might you want to have persist on an order object to take potential future transactions into account in light of this? Could we solve it even without persisting any new data?

Pro Tips:
>>> This is an actual, real-world problem, not a curated leetcode challenge. It isn't similar to, nor is it attempting to be similar to, leetcode-style problems. If you find yourself thinking "Ahh! They're testing me on this ONE concept I've seen before in that algorithms class I took last year", that instinct is probably wrong. As a real-world problem, it's more idiosyncratic than you might be used to.
>>> Read through the test cases and make sure your approach considers each one *BEFORE* you start coding! This will save you LOTS of time.
>>> Ask questions! If you feel that you FULLY understand all the problem's "curves and edges" after 5 minutes, that might not be true.

*/

// ---------------------------------------------------------

// The test case below shows you sample input and expected output. Your solution should cover all the test cases listed in this document.

// Test Case 1
// Inputs:
let newTransAmount1 = -6.80;
let order1 = {
	"charges": [
		{"id": "5cdd802nasd10001", "amount": 20},
		{"id": "5cdd802nasd10002", "amount": 1},
		{"id": "5cdd802nasd10003", "amount": 1},
		{"id": "5cdd802nasd10004", "amount": 2},
		{"id": "5cdd802nasd10005", "amount": 3},
		{"id": "5cdd802nasd10006", "amount": 1}
	],
	"refunds": [
		{"charge_id": "5cdd802nasd10006", "amount": -1}
	]
};


// Expected Output:
// {
// 	"charges": [
// 		{"id": "5cdd802nasd10001", "amount": 20},
// 		{"id": "5cdd802nasd10002", "amount": 1},
// 		{"id": "5cdd802nasd10003", "amount": 1},
// 		{"id": "5cdd802nasd10004", "amount": 2},
// 		{"id": "5cdd802nasd10005", "amount": 3},
// 		{"id": "5cdd802nasd10006", "amount": 1}
// 	],
// 	"refunds": [
// 		{"charge_id": "5cdd802nasd10006", "amount": -1},
// 		{"charge_id": "5cdd802nasd10002", "amount": -1},
// 		{"charge_id": "5cdd802nasd10003", "amount": -1},
// 		{"charge_id": "5cdd802nasd10004", "amount": -2},
// 		{"charge_id": "5cdd802nasd10005", "amount": -2.8}
// 	]
// }

// ---------------------------------------------------------

// Test Case 2: Do you always start by refunding the smallest charges first, or is there something else to take into account? If there are multiple "smallest" charges of the same amount, does it really never matter which one you start by refunding?
// Inputs:
let newTransAmount2 = -1.3;
let order2 = {
	"charges": [
		{"id": "5cdd802nasd10001", "amount": 20},
		{"id": "5cdd802nasd10002", "amount": 1},
		{"id": "5cdd802nasd10003", "amount": 1},
		{"id": "5cdd802nasd10004", "amount": 2},
		{"id": "5cdd802nasd10005", "amount": 3},
		{"id": "5cdd802nasd10006", "amount": 1}
	],
	"refunds": [
		{"charge_id": "5cdd802nasd10006", "amount": -0.6}
	]
};

// Expected Output:
// {
// 	"charges": [
// 		{"id": "5cdd802nasd10001", "amount": 20},
// 		{"id": "5cdd802nasd10002", "amount": 1},
// 		{"id": "5cdd802nasd10003", "amount": 1},
// 		{"id": "5cdd802nasd10004", "amount": 2},
// 		{"id": "5cdd802nasd10005", "amount": 3},
// 		{"id": "5cdd802nasd10006", "amount": 1}
// 	],
// 	"refunds": [
// 		{"charge_id": "5cdd802nasd10006", "amount": -0.6},
// 		{"charge_id": "5cdd802nasd10006", "amount": -0.4},
// 		{"charge_id": "5cdd802nasd10003", "amount": -0.9}
// 	]
// }

// ---------------------------------------------------------

// Test Case 3: What if there are multiple existing refunds relating to the same charge?
// Inputs:
let newTransAmount3 = -6;
let order3 = {
	"charges": [
		{"id": "5cdd802nasd10001", "amount": 20},
		{"id": "5cdd802nasd10002", "amount": 1},
		{"id": "5cdd802nasd10003", "amount": 2},
		{"id": "5cdd802nasd10004", "amount": 3}
	],
	"refunds": [
		{"charge_id": "5cdd802nasd10002", "amount": -0.3},
		{"charge_id": "5cdd802nasd10002", "amount": -0.7},
		{"charge_id": "5cdd802nasd10003", "amount": -1.5}
	]
};

// Expected Output:
// {
// 	"charges": [
// 		{"id": "5cdd802nasd10001", "amount": 20},
// 		{"id": "5cdd802nasd10002", "amount": 1},
// 		{"id": "5cdd802nasd10003", "amount": 2},
// 		{"id": "5cdd802nasd10004", "amount": 3}
// 	],
// 	"refunds": [
// 		{"charge_id": "5cdd802nasd10002", "amount": -0.3},
// 		{"charge_id": "5cdd802nasd10002", "amount": -0.7},
// 		{"charge_id": "5cdd802nasd10003", "amount": -1.5},
//		{"charge_id": "5cdd802nasd10003", "amount": -0.5},
//		{"charge_id": "5cdd802nasd10004", "amount": -3.0},
//		{"charge_id": "5cdd802nasd10001", "amount": -2.5}
// 	]
// }

// ---------------------------------------------------------

// Test Case 4: What if new transaction is positive (i.e. it's just a new charge, not a refund)?
// Inputs:
let newTransAmount4 = 4;
let order4 = {
	"charges": [
		{"id": "5cdd802nasd10001", "amount": 20},
		{"id": "5cdd802nasd10002", "amount": 1},
		{"id": "5cdd802nasd10003", "amount": 1},
		{"id": "5cdd802nasd10004", "amount": 2},
		{"id": "5cdd802nasd10005", "amount": 3},
		{"id": "5cdd802nasd10006", "amount": 1}
	],
	"refunds": [
		{"charge_id": "5cdd802nasd10006", "amount": -1}
	]
};

// Expected Output:
// {
// 	"charges": [
// 		{"id": "5cdd802nasd10001", "amount": 20},
// 		{"id": "5cdd802nasd10002", "amount": 1},
// 		{"id": "5cdd802nasd10003", "amount": 1},
// 		{"id": "5cdd802nasd10004", "amount": 2},
// 		{"id": "5cdd802nasd10005", "amount": 3},
// 		{"id": "5cdd802nasd10006", "amount": 1},
// 		{"id": "5cdd802nasd10007", "amount": 4}
// 	],
// 	"refunds": [
// 		{"charge_id": "5cdd802nasd10006", "amount": -1}
// 	]
// }

// ---------------------------------------------------------

// Test Case 5 (edge case): What if new transaction is zero? do you really need to change the order object at all?
// Inputs:
let newTransAmount5 = 0;
let order5 = {
	"charges": [
		{"id": "5cdd802nasd10001", "amount": 20},
		{"id": "5cdd802nasd10002", "amount": 1},
		{"id": "5cdd802nasd10003", "amount": 1},
		{"id": "5cdd802nasd10004", "amount": 2},
		{"id": "5cdd802nasd10005", "amount": 3},
		{"id": "5cdd802nasd10006", "amount": 1}
	],
	"refunds": [
		{"charge_id": "5cdd802nasd10006", "amount": -1}
	]
};

// Expected Output:
// {
// 	"charges": [
// 		{"id": "5cdd802nasd10001", "amount": 20},
// 		{"id": "5cdd802nasd10002", "amount": 1},
// 		{"id": "5cdd802nasd10003", "amount": 1},
// 		{"id": "5cdd802nasd10004", "amount": 2},
// 		{"id": "5cdd802nasd10005", "amount": 3},
// 		{"id": "5cdd802nasd10006", "amount": 1}
// 	],
// 	"refunds": [
// 		{"charge_id": "5cdd802nasd10006", "amount": -1}
// 	]
// }

// ---------------------------------------------------------

// Test Case 6 (edge case): What if absolute value of new refund amount exceeds sum of all existing charges? (After all, you can only refund what has been charged, not more.)
// Inputs:
let newTransAmount6 = -57;
let order6 = {
	"charges": [
		{"id": "5cdd802nasd10001", "amount": 20},
		{"id": "5cdd802nasd10002", "amount": 1},
		{"id": "5cdd802nasd10003", "amount": 1},
		{"id": "5cdd802nasd10004", "amount": 2},
		{"id": "5cdd802nasd10005", "amount": 3},
		{"id": "5cdd802nasd10006", "amount": 1}
	],
	"refunds": [],
};

// Expected Output:
// {
// 	"charges": [
// 		{"id": "5cdd802nasd10001", "amount": 20},
// 		{"id": "5cdd802nasd10002", "amount": 1},
// 		{"id": "5cdd802nasd10003", "amount": 1},
// 		{"id": "5cdd802nasd10004", "amount": 2},
// 		{"id": "5cdd802nasd10005", "amount": 3},
// 		{"id": "5cdd802nasd10006", "amount": 1}
// 	],
// 	"refunds": [
// 		{"charge_id": "5cdd802nasd10006", "amount": -1},
//		{"charge_id": "5cdd802nasd10003", "amount": -1},
//		{"charge_id": "5cdd802nasd10002", "amount": -1},
//		{"charge_id": "5cdd802nasd10004", "amount": -2},
//		{"charge_id": "5cdd802nasd10005", "amount": -3},
//		{"charge_id": "5cdd802nasd10001", "amount": -20}
// 	]
// }

// ---------------------------------------------------------

// console.log(order1.charges[1].amount)
// console.log(order2.charges[1].amount.sum)
// console.log(order1.charges.length )
// this code works
// for (var i = 0; i < order3.charges.length; i++){
// 	console.log(  order3.charges.sort((a,b) => (a.amount>b.amount) ? 1:-1)
// 	);
// 	}
// let theorder= order2.refunds
// order2.refunds.push({
// 	"charge_id": "5cdd802nasd10002",
// 	"amount": 20
// })
// // var refunder3=object.map(function(charge_id)
// // var refunder2= ([`${charge_id2}: "5cdd802nasd10002", ${amount1} : 20`]); 
// // var refunder= (["charge_id: 5cdd802nasd10002", "amount : 20"]); 
// // console.log(order2.refunds);
// // console.log(order2.refunds)

function processNewTransaction(orderObject, newTransAmount) {  
    // trying to modify the the charge amount to the actual amount(by adding the refund amount and the charge amount of the same order). 
	//    my iteration that I use throughout. Here is how I accessed the object properties within this function. this works.
let clonedCharges1= [...orderObject.charges];

	for (var i = 0; i < orderObject.refunds.length; i++) { 
		var currentRefund=orderObject.refunds[i];
		for (var i = 0; i < orderObject.charges.length; i++) { 
			var currentCharge=clonedCharges1[i];
			if (currentRefund.charge_id === currentCharge.id){
				let newchargeamount =currentCharge.amount + currentRefund.amount;
				currentCharge.amount= newchargeamount
			}
		}
	}
    // creating a sorting method to index the actual charge(plus refund amount from lowest to highest so the maximum amount of full refunds can be acheived).Final version of below code. I went through several sorting methods to get to its most effecient. This code works.
	clonedCharges1=clonedCharges1.sort((a,b) => a.amount-b.amount)
    // creating the math problem that will refund charge amounts one by one (starting with the lowest first). Very tough. Please see other JS file for my thought process.
			
			let remainingTransAmount = 0 - newTransAmount;
			for (let i = 0; i < clonedCharges1.length && remainingTransAmount > 0; i++) {
			  const charge = clonedCharges1[i];
			  const amountAppliedToCharge = Math.min(charge.amount, remainingTransAmount)
			  if (amountAppliedToCharge > 0) {
				remainingTransAmount -= amountAppliedToCharge;
				orderObject.refunds.push({
				  charge_id: charge.id,
				  amount: 0 - amountAppliedToCharge
				})
			  }
			}
			return orderObject;
}
// --



// RUN YOUR CODE AGAINST EACH TEST CASE
processNewTransaction(order1, newTransAmount1);
processNewTransaction(order2, newTransAmount2);
processNewTransaction(order3, newTransAmount3);
processNewTransaction(order4, newTransAmount4);
processNewTransaction(order5, newTransAmount5);
processNewTransaction(order6, newTransAmount6);

// --------------------------------------------------