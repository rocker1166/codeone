// app/api/combine/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    const combinedContent: string[] = [];

    for (const file of files) {
      const content = await file.text();
      const relativePath = file.webkitRelativePath || file.name; // Use webkitRelativePath for folder structure
      combinedContent.push(`File: ${relativePath}\n\n${content}\n\n`);
    }

    // Append "hello world" once to the entire combined content
    combinedContent.push(`
      I will provide you with the entire codebase of my website. Your job is to help me fix bugs, add new features, and make improvements as needed. Whenever a change is made in one file, you must ensure that any other related files are updated to maintain consistency and functionality.

      Key points:

      - Use only the code and features I provide. Do not create new files unless explicitly asked to do so.
      - Always treat the first input document I provide as the main reference and context.
      - Ensure that all modifications, additions, or fixes are integrated seamlessly across the entire codebase.
      - If a feature is requested that requires updating multiple parts of the codebase, make sure that changes are made across all affected files.

      All code is given in the upper side.
    `);

    const outputFileName = `codecontext_codeone_${uuidv4()}.txt`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const outputPath = path.join(uploadsDir, outputFileName);

    // Ensure the uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Write the combined content to the file
    await fs.writeFile(outputPath, combinedContent.join('---\n\n'));

    const downloadUrl = `/uploads/${outputFileName}`;

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error('Error in POST /api/combine:', error);
    return NextResponse.json({ error: 'An error occurred while processing the files' }, { status: 500 });
  }
}
