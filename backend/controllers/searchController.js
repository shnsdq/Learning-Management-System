import Course from "../models/courseModel.js"
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
dotenv.config()


const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const findCourses = (term) => {
    const safe = escapeRegex(term)
    const rx = { $regex: safe, $options: 'i' }
    return Course.find({
        isPublished: true,
        $or: [{ title: rx }, { subTitle: rx }, { description: rx }, { category: rx }, { level: rx }]
    })
}

const buildPrompt = (query) => `You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:

- App Development
- AI/ML
- AI Tools
- Data Science
- Data Analytics
- Ethical Hacking
- UI UX Designing
- Web Development
- Others
- Beginner
- Intermediate
- Advanced

Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.

Query: ${query}
`

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body
        if (!input?.trim()) {
            return res.status(400).json({ message: "Search query is required" })
        }
        const query = input.trim()

        // plain search first: fast, no AI cost
        let courses = await findCourses(query)

        // AI keyword only as a fallback, and allowed to fail
        if (courses.length === 0) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
                const response = await ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents: buildPrompt(query),
                })
                const keyword = response.text?.trim().replace(/^[-\s]+|[.\s]+$/g, '')
                if (keyword) courses = await findCourses(keyword)

            } catch (aiError) {
                console.log("AI keyword step failed:", aiError)
            }
        }

        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: `Failed to search ${error}` })
    }
}