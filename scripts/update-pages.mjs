import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf8')

const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value.length) {
    env[key.trim()] = value.join('=').trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const pages = [
  {
    slug: 'contact',
    title: 'Contact Us',
    content: `We'd love to hear from you! Whether you have a question about our AI tools directory, need support, want to suggest a tool, or have any other inquiry, feel free to reach out.

## Get in Touch

### 📧 General Inquiries
For general questions about AI Dash Tools:
**Email:** info@aidashtools.com

### 💼 Business & Partnerships
Interested in advertising, partnerships, or business opportunities:
**Email:** business@aidashtools.com

### 🤝 Affiliate Program
Questions about our affiliate program:
**Email:** affiliates@aidashtools.com

### 🛠️ Submit a Tool
Want to suggest an AI tool to be featured on our directory:
**Email:** submit@aidashtools.com

### 🔒 Privacy & Legal
Privacy concerns or legal inquiries:
**Email:** legal@aidashtools.com

### 💡 Feedback & Suggestions
Have ideas to improve our website:
**Email:** feedback@aidashtools.com

## Response Time
**⏰ Response Time:** We typically respond to all inquiries within 24-48 hours during business days (Monday-Friday). We appreciate your patience!

## About AI Dash Tools
AI Dash Tools is your comprehensive directory of artificial intelligence tools and platforms. We help individuals and businesses discover the best AI solutions for chatbots, image creation, video production, music generation, programming, web design, and data analytics.

**Created by:** RabbidPixelsLLC
**Website:** aidashtools.com`
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    content: `**Last Updated:** January 2025

## 1. Agreement to Terms
By accessing and using AI Dash Tools ("the Website"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use this website.

## 2. Use License
Permission is granted to temporarily access the materials (information or software) on AI Dash Tools for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials
- Use the materials for any commercial purpose or public display
- Attempt to decompile or reverse engineer any software contained on the Website
- Remove any copyright or other proprietary notations from the materials
- Transfer the materials to another person or "mirror" the materials on any other server

## 3. Disclaimer
The materials on AI Dash Tools are provided on an 'as is' basis. AI Dash Tools makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 4. Limitations
In no event shall AI Dash Tools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI Dash Tools, even if AI Dash Tools or an authorized representative has been notified orally or in writing of the possibility of such damage.

## 5. Accuracy of Materials
The materials appearing on AI Dash Tools could include technical, typographical, or photographic errors. AI Dash Tools does not warrant that any of the materials on its website are accurate, complete, or current. AI Dash Tools may make changes to the materials contained on its website at any time without notice.

## 6. Links to Third-Party Websites
AI Dash Tools has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AI Dash Tools of the site. Use of any such linked website is at the user's own risk.

## 7. Affiliate Links
AI Dash Tools may contain affiliate links to third-party products or services. When you click on these links and make a purchase, we may receive a commission at no additional cost to you. We only recommend products and services we believe will provide value to our users.

## 8. User Conduct
You agree not to use the Website to:

- Violate any applicable laws or regulations
- Infringe upon or violate our intellectual property rights or the intellectual property rights of others
- Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
- Submit false or misleading information
- Upload or transmit viruses or any other type of malicious code
- Engage in any automated use of the system

## 9. Intellectual Property
The Website and its original content, features, and functionality are and will remain the exclusive property of AI Dash Tools and its licensors. The Website is protected by copyright, trademark, and other laws.

## 10. Modifications
AI Dash Tools may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.

## 11. Governing Law
These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.

## 12. Contact Information
If you have any questions about these Terms of Service, please contact us at:

**Email:** legal@aidashtools.com`
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    content: `**Last Updated:** January 2025

## 1. Introduction
Welcome to AI Dash Tools ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.

## 2. Information We Collect
We may collect, use, store and transfer different kinds of personal data about you:

- **Technical Data:** Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform
- **Usage Data:** Information about how you use our website, products and services
- **Marketing and Communications Data:** Your preferences in receiving marketing from us and your communication preferences

## 3. How We Use Your Information
We use your information to:

- Provide, operate, and maintain our website
- Improve, personalize, and expand our website
- Understand and analyze how you use our website
- Develop new products, services, features, and functionality
- Communicate with you for customer service and support
- Send you marketing and promotional communications (with your consent)

## 4. Cookies and Tracking Technologies
We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.

## 5. Google AdSense
We use Google AdSense to display advertisements on our website. Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings.

## 6. Third-Party Links
Our website may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

## 7. Data Security
We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.

## 8. Your Rights
Depending on your location, you may have the following rights:

- Right to access your personal data
- Right to rectification of inaccurate data
- Right to erasure of your personal data
- Right to restrict processing
- Right to data portability
- Right to object to processing

## 9. Children's Privacy
Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

## 10. Changes to This Privacy Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

## 11. Contact Us
If you have any questions about this Privacy Policy, please contact us at:

**Email:** privacy@aidashtools.com`
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    content: `**Last Updated:** January 2025

## General Information
The information provided by AI Dash Tools ("we," "us," or "our") on aidashtools.com (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.

## External Links Disclaimer
The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.

WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING.

## Professional Disclaimer
The Site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.

## AI Tools Information
The information about AI tools and services listed on this website is gathered from publicly available sources and is subject to change without notice. We do not guarantee:

- The availability, features, or pricing of any listed AI tool
- The accuracy of tool descriptions or capabilities
- The performance or results you may achieve using any listed tool
- That any tool will meet your specific requirements

Users should conduct their own research and due diligence before purchasing or subscribing to any AI tool or service.

## Affiliate Relationships Disclaimer
AI Dash Tools participates in various affiliate marketing programs, which means we may get paid commissions on purchases made through our links to retailer sites. This comes at no additional cost to you. Our affiliate relationships do not influence our reviews or recommendations.

## Testimonials Disclaimer
The Site may contain testimonials by users of our services and/or products. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services.

## No Guarantees
We do not guarantee any specific results from using the information, tools, or services referenced on this Site. Results may vary based on individual circumstances, effort, and other factors beyond our control.

## Errors and Omissions Disclaimer
While we have made every attempt to ensure that the information contained in this Site has been obtained from reliable sources, AI Dash Tools is not responsible for any errors or omissions or for the results obtained from the use of this information.

## Fair Use Disclaimer
This Site may use copyrighted material which has not always been specifically authorized by the copyright owner. We believe this constitutes a 'fair use' of any such copyrighted material as provided for in section 107 of the US Copyright Law. If you wish to use copyrighted material from this site for purposes of your own that go beyond fair use, you must obtain permission from the copyright owner.

## Changes and Amendments
We reserve the right to modify this disclaimer or its terms relating to the Site at any time, effective upon posting of an updated version of this disclaimer on the Site. Continued use of the Site after any such changes shall constitute your consent to such changes.

## Contact Us
If you have any questions about this Disclaimer, please contact us at:

**Email:** info@aidashtools.com`
  },
  {
    slug: 'affiliate-disclosure',
    title: 'Affiliate Disclosure',
    content: `**Last Updated:** January 2025

**Important Notice:** AI Dash Tools participates in affiliate marketing programs. This page explains our affiliate relationships and how they may affect you as a visitor to our website.

## What Are Affiliate Links?
Affiliate links are special tracking URLs that allow us to earn a commission when you click on them and make a purchase from the linked website. These links help us generate revenue to maintain and improve our free directory of AI tools.

## Our Affiliate Relationships
AI Dash Tools may receive compensation when you click on or make purchases through affiliate links on our website. We participate in various affiliate programs including, but not limited to:

- Direct affiliate programs with AI tool companies
- Third-party affiliate networks
- Referral programs
- Partnership programs

## How This Affects You
**No Additional Cost:** When you purchase through our affiliate links, you pay the same price as you would if you went directly to the vendor's website. The commission we receive comes from the vendor, not from you.

**Your Support Helps Us:** By using our affiliate links, you help support AI Dash Tools at no extra cost to you. This allows us to continue providing free, valuable information about AI tools and services.

## Our Editorial Independence
While we do earn commissions from affiliate links, this does not influence our recommendations or reviews. We are committed to:

- **Honest Reviews:** We provide genuine, unbiased information about AI tools
- **Transparent Recommendations:** We only recommend tools we believe offer value
- **Disclosure:** We clearly disclose when content contains affiliate links
- **User First:** Our primary goal is to help you find the best AI tools for your needs

## Not All Links Are Affiliate Links
Not every link on our website is an affiliate link. Some links are provided purely for informational purposes to help you learn more about a product or service, without any compensation to us.

## Our Selection Process
The AI tools featured on our website are selected based on:

- Popularity and user adoption
- Features and functionality
- User reviews and reputation
- Innovation and quality
- Usefulness to our audience

The availability of an affiliate program is considered but is not the primary factor in whether we list a tool on our website.

## FTC Compliance
In accordance with the Federal Trade Commission's 16 CFR Part 255, "Guides Concerning the Use of Endorsements and Testimonials in Advertising," we are required to disclose our affiliate relationships. This disclosure statement is provided to ensure full transparency with our visitors.

## Third-Party Cookies
When you click on an affiliate link, the merchant may place a cookie on your browser to track the referral. This cookie helps ensure we receive credit for the referral. These cookies are controlled by the third-party merchants, not by AI Dash Tools.

## Your Privacy
We take your privacy seriously. While affiliate links may use cookies for tracking purposes, we do not collect or store personal information about your purchases. For more information about how we handle data, please review our Privacy Policy.

## Changes to This Disclosure
We may update this Affiliate Disclosure from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this page periodically.

## Questions About Our Affiliate Relationships
If you have any questions about our affiliate relationships or this disclosure, please don't hesitate to contact us:

**Email:** affiliates@aidashtools.com

## Thank You
We appreciate your support! By using our affiliate links when making purchases, you help us keep AI Dash Tools free and enable us to continue providing valuable resources about AI tools and technologies.`
  }
]

async function updatePages() {
  console.log('🚀 Starting page content update...\n')

  for (const page of pages) {
    console.log(`📝 Updating ${page.slug}...`)

    const { error } = await supabase
      .from('pages')
      .update({
        title: page.title,
        content: page.content,
        updated_at: new Date().toISOString()
      })
      .eq('slug', page.slug)

    if (error) {
      console.error(`❌ Error updating ${page.slug}:`, error.message)
    } else {
      console.log(`✅ Successfully updated ${page.slug}`)
    }
  }

  console.log('\n🎉 Page content update completed!')
}

updatePages().catch(console.error)
