import hummus from 'hummus';
import { IDrawingImage } from './interfaces';
import constants from './constants';

const { IS_IMAGE_INDEPENDENT_OF_EXISTING_GRAPHICS_STATE, DEFAULT_MEDIA_BOX_SIZE } = constants;

function drawImageInPdf(context: any, drawingImage: IDrawingImage): void {
  const { bottom, left, imgPath, transformation } = drawingImage;
  const options = (transformation) ? { transformation } : undefined;

  context.drawImage(bottom, left, imgPath, options);
}

export function drawAndCreateNewPdf(targetPath: string, drawingImages: IDrawingImage[], pageSize?: number[]): void {

  const pdfWriter = hummus.createWriter(targetPath);
  const page = pdfWriter.createPage(pageSize || DEFAULT_MEDIA_BOX_SIZE);

  const context = pdfWriter.startPageContentContext(page);

  drawingImages.forEach(drawingImage => drawImageInPdf(context, drawingImage));

  pdfWriter.writePage(page);
  pdfWriter.end();
}

export function drawAndModifyPdf(targetPath: string, drawingImages: IDrawingImage[], pageIndex: number = 0): void {

  const pdfWriter = hummus.createWriterToModify(targetPath, { modifiedFilePath: targetPath });
  const pageModifier = new hummus.PDFPageModifier(pdfWriter, pageIndex, IS_IMAGE_INDEPENDENT_OF_EXISTING_GRAPHICS_STATE);

  const context = pageModifier.startContext().getContext();

  drawingImages.forEach(drawingImage => drawImageInPdf(context, drawingImage));

  pageModifier.endContext().writePage();
  pdfWriter.end();
}
