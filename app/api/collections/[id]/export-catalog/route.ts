import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'lecturer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      collectionName, coverImageUrl, mainTitle, eventTheme, academicYear, departmentInfo,
      prefaceHtml, epilogueHtml, artworkIds, enabledArtworkIds, layoutStyle,
    } = body;

    const artworks = await prisma.artwork.findMany({
      where: { id: { in: enabledArtworkIds || [] } },
      include: {
        user: { select: { id: true, fullName: true, studentId: true } },
      },
    });

    const artworkMap = Object.fromEntries(artworks.map((a) => [a.id, a]));
    const sortedArtworks = (artworkIds || [])
      .filter((id: string) => (enabledArtworkIds || []).includes(id))
      .map((id: string) => artworkMap[id])
      .filter(Boolean);

    const bgStyle = coverImageUrl
      ? 'background:' + coverImageUrl + ' center/cover no-repeat;'
      : 'background:linear-gradient(135deg,#1a1a2e,#16213e);';

    const parts: string[] = [];
    let pageNum = 1;

    const css = `
      @page{size:A4;margin:0;}
      body{margin:0;font-family:Georgia,'Times New Roman',serif;}
      .page{width:210mm;min-height:297mm;padding:48px 60px;box-sizing:border-box;page-break-after:always;}
      .cover{display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;color:#fff;${bgStyle}}
      .cover h1{font-size:44px;font-weight:900;margin:0 0 6px;text-shadow:0 2px 20px rgba(0,0,0,0.6);line-height:1.15;}
      .cover .sub{font-size:20px;margin:0 0 4px;opacity:0.9;font-weight:400;}
      .cover .meta{margin-top:24px;font-size:13px;opacity:0.65;border-top:1px solid rgba(255,255,255,0.25);padding-top:14px;width:100%;}
      .cover .pg{font-size:10px;color:rgba(255,255,255,0.4);margin-top:40px;}
      .artpage{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;}
      .artpage img{max-width:90%;max-height:55vh;object-fit:contain;border-radius:6px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
      .artpage h2{font-size:24px;margin:0 0 4px;color:#212121;}
      .artpage .student{font-size:15px;color:#666;margin:0 0 6px;}
      .artpage .desc{font-size:13px;color:#777;max-width:70%;line-height:1.6;}
      .textpage{padding:60px 56px;}
      .textpage h2{font-size:30px;margin-bottom:20px;color:#212121;font-weight:700;}
      .textpage p{font-size:14px;line-height:1.9;color:#444;}
      .toc{padding:60px 56px;}
      .toc h2{font-size:28px;margin-bottom:28px;color:#212121;}
      .toc-item{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px dotted #ddd;font-size:14px;color:#333;}
      .pgnum{font-size:10px;color:#bbb;margin-top:32px;text-align:center;}
      .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;height:100%;}
    `;

    parts.push('<!DOCTYPE html><html><head><style>' + css + '</style></head><body>');

    parts.push('<div class="page cover">');
    if (mainTitle) parts.push('<h1>' + escHtml(mainTitle) + '</h1>');
    if (eventTheme) parts.push('<p class="sub">' + escHtml(eventTheme) + '</p>');
    const metaParts = [academicYear, departmentInfo].filter(Boolean);
    if (metaParts.length > 0) parts.push('<div class="meta">' + metaParts.join(' · ') + '</div>');
    parts.push('<p class="pg">Trang ' + pageNum + '</p>');
    parts.push('</div>');
    pageNum++;

    if (prefaceHtml) {
      parts.push('<div class="page textpage"><h2>Lời mở đầu</h2>' + prefaceHtml + '<p class="pgnum">Trang ' + pageNum + '</p></div>');
      pageNum++;
    }

    for (let i = 0; i < sortedArtworks.length; i++) {
      const art = sortedArtworks[i];
      if (layoutStyle === 'modern' && i % 2 === 0) {
        const next = sortedArtworks[i + 1];
        parts.push('<div class="page artpage"><div class="grid-2">');
        addArtworkHtml(parts, art, false);
        if (next) addArtworkHtml(parts, next, false);
        parts.push('</div><p class="pgnum">Trang ' + pageNum + '</p></div>');
        i++;
      } else {
        parts.push('<div class="page artpage">');
        addArtworkHtml(parts, art, true);
        parts.push('<p class="pgnum">Trang ' + pageNum + '</p></div>');
      }
      pageNum++;
    }

    if (epilogueHtml) {
      parts.push('<div class="page textpage"><h2>Lời kết</h2>' + epilogueHtml + '<p class="pgnum">Trang ' + pageNum + '</p></div>');
      pageNum++;
    }

    parts.push('</body></html>');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const pdfDir = path.join(process.cwd(), 'public', 'exports');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const safeName = (collectionName || 'catalog').replace(/[^a-zA-Z0-9]/g, '_');
    const pdfFilename = safeName + '_' + Date.now() + '.pdf';
    const pdfPath = path.join(pdfDir, pdfFilename);

    const page = await browser.newPage();
    await page.setContent(parts.join('\n'), { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    return NextResponse.json({ success: true, pdfUrl: '/exports/' + pdfFilename, pages: pageNum - 1 });
  } catch (error) {
    console.error('Export catalog error:', error);
    return NextResponse.json({ error: error?.toString() || 'Internal server error' }, { status: 500 });
  }
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addArtworkHtml(parts: string[], art: any, fullWidth: boolean) {
  if (fullWidth) {
    parts.push('<img src="' + escHtml(art.coverImageUrl || '') + '" alt="' + escHtml(art.title || '') + '" />');
    parts.push('<h2>' + escHtml(art.title || 'Untitled') + '</h2>');
    const name = art.user?.fullName || '';
    const sid = art.user?.studentId || '';
    parts.push('<p class="student">' + escHtml(name) + (sid ? ' (' + escHtml(sid) + ')' : '') + '</p>');
    if (art.description) parts.push('<p class="desc">' + escHtml(art.description.substring(0, 200)) + '</p>');
  } else {
    parts.push('<div>');
    parts.push('<img src="' + escHtml(art.coverImageUrl || '') + '" alt="' + escHtml(art.title || '') + '" style="max-height:35vh;margin-bottom:12px;" />');
    parts.push('<h2 style="font-size:18px;">' + escHtml(art.title || 'Untitled') + '</h2>');
    parts.push('<p class="student" style="font-size:13px;">' + escHtml(art.user?.fullName || '') + '</p>');
    parts.push('</div>');
  }
}
