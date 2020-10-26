import { PublisherService } from '@app/_services/publisher/publisher.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService, BookService } from '@app/_services';
import { first } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { WriterService } from '@app/_services/writer/writer.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  fileToUpload: File = null;
  publisherList: any;

  authors: any = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
    maxHeight: 200
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private publisherSrvc: PublisherService,
    private bookSrvc: BookService,
    private authorSrvc: WriterService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    console.log('Captured Id', this.id);
    this.loadExtras();

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      sinoptics: ['', Validators.required],
      slug: [''],
      total_pages: ['', Validators.required],
      price_un: ['', Validators.required],
      isbn: ['', Validators.required],
      published_at: ['', Validators.required],
      publisher_id: [''],
      cover: [''],
      authors: ['', Validators.required],
      recommendations: ['']
    });

    if (!this.isAddMode) {
      this.bookSrvc.getBookById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.f.title.setValue(x.content.title);
          this.f.sinoptics.setValue(x.content.sinoptics);
          this.f.slug.setValue(x.content.slug);
          this.f.total_pages.setValue(x.content.total_pages);
          this.f.price_un.setValue(x.content.price_un);
          this.f.isbn.setValue(x.content.isbn);
          this.f.published_at.setValue(x.content.published_at);
          this.f.publisher_id.setValue(x.content.publisher_id);
          this.f.cover.setValue(x.content.cover);
          this.f.recommendations.setValue(x.content.recommendations);
          this.f.authors.setValue(x.content.authors);

          console.log('Book loaded', x);

        });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.f.cover.setValue(this.fileToUpload);
  }

  buildSlug(val: string): string {
    let slug = val.split(' ');
    let result = slug[0];
    for (let index = 1; index < slug.length; index++) {
      result += `_${slug[index]}`;
    }
    return result.toLocaleLowerCase();
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createBook();
    } else {
      this.updateBook();
    }
  }

  private createBook() {
    const formData: FormData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('sinoptics', this.form.value.sinoptics);
    formData.append('slug', this.buildSlug(this.form.value.title));
    formData.append('total_pages', this.form.value.total_pages);
    formData.append('price_un', this.form.value.price_un);
    formData.append('isbn', this.form.value.isbn);
    formData.append('published_at', this.form.value.published_at);
    formData.append('publisher_id', this.form.value.publisher_id);
    formData.append('recommendations', this.form.value.recommendations);

    if (this.fileToUpload) {
      formData.append('cover', this.fileToUpload, this.fileToUpload.name);
    }

    if (this.form.value.authors && this.form.value.authors.length > 0) {
      let values = [];
      for (const item of this.form.value.authors) {
        values.push(item.id);
      }
      var arrayData = JSON.stringify(values);
      formData.append('authors', arrayData);
    }

    this.bookSrvc.create(formData)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Book added successfully', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  private updateBook() {
    const formData: FormData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('sinoptics', this.form.value.sinoptics);
    formData.append('slug', this.buildSlug(this.form.value.title));
    formData.append('total_pages', this.form.value.total_pages);
    formData.append('price_un', this.form.value.price_un);
    formData.append('isbn', this.form.value.isbn);
    formData.append('published_at', this.form.value.published_at);
    formData.append('publisher_id', this.form.value.publisher_id);
    formData.append('recommendations', this.form.value.recommendations);

    if (this.fileToUpload) {
      formData.append('cover', this.fileToUpload, this.fileToUpload.name);
    }

    if (this.form.value.authors && this.form.value.authors.length > 0) {
      let values = [];
      for (const item of this.form.value.authors) {
        values.push(item.id);
      }
      var arrayData = JSON.stringify(values);
      formData.append('authors', arrayData);
    }

    this.bookSrvc.update(this.id, formData)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  loadExtras() {
    this.publisherSrvc.all({}).subscribe((response: any) => {
      console.log('All books loaded sucessfull', response);
      this.publisherList = response.content;
    }, error => {
      console.log('Error loading books', error);

    });

    this.authorSrvc.all({}).subscribe((response: any) => {
      console.log('All books loaded sucessfull', response);
      this.authors = response.content;
    }, error => {
      console.log('Error loading books', error);
    });
  }

}
