import { Button } from '@components/ui'
import TextArea from '@components/ui/TextArea'
import { Box, Typography } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import useReviews, { ProductReviewProps } from 'hooks/useReviews'
import { useEffect, useState } from 'react'
import s from './ProductReview.module.scss'
import moment from 'moment'

const ProductReview = ({ reviews }: { reviews: ProductReviewProps[] }) => {
  useEffect(() => {
    console.log(reviews)
  }, [reviews])

  return (
    <div className={s.root}>
      <h2 className={s.reviewheading}>Write a Review</h2>
      <WriteReview />
      <div className={s.allreviews}>
      <h2 className={s.reviewheading}>All Reviews</h2>
      {
        reviews?.map((r, id) => <ProductReviewItem key={`rev-${r.id}`} data={r} />)
      }
      </div>
    </div>
  )
}

export default ProductReview

const WriteReview = () => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)

  return (
    <div className={s.writereview}>
      <Box component="fieldset" mb={1} borderColor="transparent" >
        <Typography className="ml-1" component="legend">
          Rating
        </Typography>
        <Rating
          name="simple-controlled"
          value={rating}
          size="large"
          onChange={(event, newValue) => {
            setRating(newValue as number)
            if(newValue) {
              setIsDisabled(false)
            } else {
              setIsDisabled(true)
            }
          }}
        />
      </Box>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Typography className="ml-1" component="legend">
          Comments
        </Typography>
        <TextArea
          className={s.reviewtextarea}
          placeholder="Write your review here..."
          onChange={(event) => {
            setComment(event.target.value)
          }}
        />
      </Box>
      <Button variant="slim" className={s.reviewbtn} disabled={isDisabled} >
        Submit Review
      </Button>
    </div>
  )
}

const ProductReviewItem = ({data}: {data: ProductReviewProps}) => {
  return <div className={s.reviewitem}>
    <div>
      <span className={s.rfullname}>{data.name}</span>
      <span className={s.rdate}>{moment(data.date_created).format('DD MMM, YYYY')}</span>
    </div>
    <Rating value={data.rating} size="small" readOnly />
    <p className={s.rcomment}>{data.text}</p>
  </div>
}
