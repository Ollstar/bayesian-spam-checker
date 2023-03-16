import csv

emails = [
    "Hey John, how's it going? Just wanted to remind you about our lunch meeting tomorrow at 12 pm. See you then!",
    "Reminder: your appointment with Dr. Smith is tomorrow at 10 am. Please remember to bring your insurance card.",
    "Thank you for your recent purchase with us. Your order has been shipped and should arrive within 3-5 business days.",
    "Congratulations on your new job! We'd like to offer you a special discount on our career coaching services to help you succeed in your new role.",
    "Dear valued customer, thank you for your loyalty. As a token of our appreciation, we're giving you a free gift with your next purchase.",
    "Your monthly statement is now available online. Please log in to view your account activity and balance.",
    "Thank you for subscribing to our newsletter. Here's a sneak peek of what's coming up in our next issue.",
    "Your flight from JFK to LAX is scheduled for departure at 2 pm. Please arrive at the airport at least 2 hours before your flight.",
    "Your Netflix subscription is about to expire. To avoid interruption of service, please update your payment information.",
    "Congratulations on your recent graduation! We'd like to offer you a special discount on our career development courses.",
    "Reminder: your car insurance payment is due on the 15th. Please log in to your account to make a payment.",
    "Thank you for your recent donation to our charity. Your support helps us make a difference in the lives of those in need.",
    "Your Amazon order has been delivered. Please log in to your account to confirm receipt and leave a review.",
    "Congratulations on your upcoming wedding! We'd like to offer you a special discount on our wedding planning services.",
    "Thank you for your recent hotel stay. We hope you enjoyed your stay and look forward to seeing you again soon.",
    "Your credit card application has been approved. You should receive your new card within 7-10 business days.",
    "Your prescription is ready for pickup at the pharmacy. Please bring your ID and insurance card with you.",
    "Reminder: your gym membership is set to renew next month. If you'd like to cancel or make changes, please log in to your account.",
    "Thank you for your recent job application. We're impressed by your skills and experience and would like to schedule an interview.",
    "Your subscription to our music streaming service has been renewed. Enjoy unlimited access to your favorite tunes!",
    "Congratulations! You've been selected to receive a free iPhone. Just click on the link to claim your prize.",
    "Urgent message from your bank: your account has been compromised. Please click on the link to update your account information.",
    "Your computer has been infected with a virus. Click here to download our software to remove it.",
    "Make $10,000 a week from home! Click here to learn how.",
    "Dear lucky winner, you've just won a million dollars! Please click on the link to claim your prize.",
    "Your package has been delayed. Please click on the link to track your shipment.",
    "Your Netflix account has been suspended. Click here to reactivate your account.",
    "Your credit score has been updated. Click here to view your new score and improve it fast.",
    "Congratulations! You've been selected for a free trip to the Bahamas. Click here to claim your prize.",
    "Your computer has been hacked. Click here to download our software and protect your device.",
    "Your Amazon account has been locked. Click here to update your payment information.",
    "Your email account has been compromised. Click here to change your password and secure your account.",
    "Make easy money from home. Click here to learn more.",
    "Your car warranty is about to expire. Click here to renew your coverage.",
    "Your PayPal account has been frozen. Click here to update your account information.",
    "Congratulations! You've been selected for a free trial of our weight loss supplement. Click here to claim your offer.",
    "Your social security number has been compromised. Click here to update your information.",
    "Your Apple ID has been locked. Click here to verify your account information.",
    "Your bank account has been compromised. Click here to update your security information.",
    "Congratulations! You've been selected for a free trial of our anti-aging cream. Click here to claim your offer.",
    "Your Facebook account has been hacked. Click here to secure your account."
]

spam_labels = ["spam"] * 20
not_spam_labels = ["not spam"] * 20
labels = spam_labels + not_spam_labels
emails.reverse()

rows = zip(emails, labels)

with open('email_dataset.tsv', mode='w', newline='') as file:  # Changed file extension to .tsv
    writer = csv.writer(file, delimiter='\t')  # Set delimiter to tab
    for row in rows:
        writer.writerow(row)